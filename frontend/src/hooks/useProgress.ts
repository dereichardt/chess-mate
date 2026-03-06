import { useEffect } from 'react';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { chessService } from '../services/chessService';
import { lessons } from '../data/lessons';

const stepCountByLessonId: Record<string, number> = Object.fromEntries(
  lessons.map((l) => [l.id, l.steps.length])
);

/**
 * Fetches progress from API and hydrates the progress store. Call once when user is authenticated (e.g. in App).
 */
export function useProgressHydration() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    useProgressStore.getState().setHydrationStatus('pending');
    chessService
      .getProgress()
      .then((data: Array<{ lessonId: string; completed: boolean; progress: number }>) => {
        if (!cancelled) {
          useProgressStore.getState().setProgressFromApi(data, stepCountByLessonId);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          useProgressStore.getState().setHydrationStatus('error');
        }
        if (import.meta.env.DEV) {
          console.warn('[Progress] Failed to load progress from server:', err?.response?.data ?? err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);
}

/**
 * Returns getProgress and progress actions that update the store and sync to the API when the user is logged in.
 * For setLastStep, pass totalSteps (e.g. lesson.steps.length) so progress 0-100 can be sent to the API.
 */
export function useProgress() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { getProgress } = useProgressStore();

  const syncMarkStarted = (lessonId: string) => {
    useProgressStore.getState().markStarted(lessonId);
    if (isAuthenticated) {
      chessService.updateLessonProgress(lessonId, false, 0).catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[Progress] Failed to save progress (is the DB seeded? run: npm run db:seed in backend):', err?.response?.data ?? err);
        }
      });
    }
  };

  const syncMarkCompleted = (lessonId: string) => {
    useProgressStore.getState().markCompleted(lessonId);
    if (isAuthenticated) {
      chessService.updateLessonProgress(lessonId, true, 100).catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[Progress] Failed to save progress (is the DB seeded? run: npm run db:seed in backend):', err?.response?.data ?? err);
        }
      });
    }
  };

  const syncSetLastStep = (lessonId: string, step: number, totalSteps: number) => {
    useProgressStore.getState().setLastStep(lessonId, step);
    if (isAuthenticated) {
      const progress =
        totalSteps <= 1 ? (step > 0 ? 100 : 0) : Math.round((step / (totalSteps - 1)) * 100);
      chessService.updateLessonProgress(lessonId, false, progress).catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[Progress] Failed to save progress (is the DB seeded? run: npm run db:seed in backend):', err?.response?.data ?? err);
        }
      });
    }
  };

  return {
    getProgress,
    markStarted: syncMarkStarted,
    markCompleted: syncMarkCompleted,
    setLastStep: syncSetLastStep,
  };
}
