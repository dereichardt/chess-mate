import { create } from 'zustand';

export interface LessonProgress {
  started: boolean;
  completed: boolean;
  lastStep: number;
}

export interface ApiProgressRecord {
  lessonId: string;
  completed: boolean;
  progress: number;
}

export type ProgressHydrationStatus = 'pending' | 'loaded' | 'error'

interface ProgressState {
  lessons: Record<string, LessonProgress>;
  /** After login, 'pending' until GET /api/progress completes; then 'loaded'. Reset to 'pending' on clear (logout). */
  hydrationStatus: ProgressHydrationStatus;
  markStarted: (id: string) => void;
  markCompleted: (id: string) => void;
  setLastStep: (id: string, step: number) => void;
  getProgress: (id: string) => LessonProgress;
  /** Replace store with API progress (e.g. after GET /api/progress). Server is source of truth. */
  setProgressFromApi: (records: ApiProgressRecord[], stepCountByLessonId: Record<string, number>) => void;
  setHydrationStatus: (status: ProgressHydrationStatus) => void;
  /** Clear all progress (e.g. on logout so the next user doesn't see stale data). */
  clear: () => void;
}

const DEFAULT_PROGRESS: LessonProgress = {
  started: false,
  completed: false,
  lastStep: 0,
};

export const useProgressStore = create<ProgressState>()((set, get) => ({
  lessons: {},
  hydrationStatus: 'pending',

  markStarted: (id: string) => {
    set((state) => ({
      lessons: {
        ...state.lessons,
        [id]: {
          ...DEFAULT_PROGRESS,
          ...state.lessons[id],
          started: true,
        },
      },
    }));
  },

  markCompleted: (id: string) => {
    set((state) => ({
      lessons: {
        ...state.lessons,
        [id]: {
          ...DEFAULT_PROGRESS,
          ...state.lessons[id],
          started: true,
          completed: true,
        },
      },
    }));
  },

  setLastStep: (id: string, step: number) => {
    set((state) => ({
      lessons: {
        ...state.lessons,
        [id]: {
          ...DEFAULT_PROGRESS,
          ...state.lessons[id],
          lastStep: step,
        },
      },
    }));
  },

  getProgress: (id: string) => {
    return get().lessons[id] ?? DEFAULT_PROGRESS;
  },

  setProgressFromApi: (records: ApiProgressRecord[], stepCountByLessonId: Record<string, number>) => {
    const nextLessons: Record<string, LessonProgress> = {};
    for (const r of records) {
      const totalSteps = stepCountByLessonId[r.lessonId] ?? 1;
      const lastStep = totalSteps <= 1 ? 0 : Math.min(Math.round((r.progress / 100) * (totalSteps - 1)), totalSteps - 1);
      nextLessons[r.lessonId] = {
        started: true,
        completed: r.completed,
        lastStep,
      };
    }
    set({ lessons: nextLessons, hydrationStatus: 'loaded' });
  },

  setHydrationStatus: (status: ProgressHydrationStatus) => set({ hydrationStatus: status }),

  clear: () => set({ lessons: {}, hydrationStatus: 'pending' }),
}));
