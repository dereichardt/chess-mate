import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { lessons } from '../data/lessons';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { isPremiumLesson } from '../utils/lessons';

const LEARN_BANNER_DISMISSED_KEY = 'chess-mate-learn-banner-dismissed';

const colorClasses: Record<number, string> = {
  1: 'bg-primary-600',
  2: 'bg-primary-600',
  3: 'bg-primary-700',
  4: 'bg-primary-700',
  5: 'bg-primary-800',
  6: 'bg-primary-800',
  7: 'bg-primary-600',
  8: 'bg-primary-600',
  9: 'bg-primary-700',
  10: 'bg-primary-700',
  11: 'bg-primary-800',
  12: 'bg-primary-800',
};

const newToChess = lessons.filter((l) => l.number >= 1 && l.number <= 6);
const beginner = lessons.filter((l) => l.number >= 7 && l.number <= 12);
const advancedBeginner = lessons.filter((l) => l.number >= 13);

function LessonCard({
  lesson,
  progress,
  colorClass,
  action,
}: {
  lesson: (typeof lessons)[0];
  progress: { started: boolean; completed: boolean };
  colorClass: string;
  action: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-4 mb-3">
        <span
          className={`w-9 h-9 rounded-card flex items-center justify-center text-sm font-bold text-white shrink-0 ${colorClass}`}
        >
          {lesson.number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-h3 font-bold text-primary-900">{lesson.title}</h2>
            {isPremiumLesson(lesson) && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold shrink-0">
                Pro
              </span>
            )}
            {progress.completed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold shrink-0">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Completed
              </span>
            )}
            {progress.started && !progress.completed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shrink-0">
                In Progress
              </span>
            )}
          </div>
          <span className="text-caption text-text-muted">{lesson.duration}</span>
        </div>
      </div>

      <p className="text-body text-text-muted flex-1 mb-4">{lesson.description}</p>

      {action}
    </Card>
  );
}

function getSectionIdForLessonNumber(lessonNumber: number): string {
  if (lessonNumber >= 1 && lessonNumber <= 6) return 'learn-section-new';
  if (lessonNumber >= 7 && lessonNumber <= 12) return 'learn-section-beginner';
  if (lessonNumber >= 13) return 'learn-section-advanced';
  return 'learn-section-new';
}

export default function LearnBasics() {
  const { getProgress } = useProgressStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const openModal = useAuthStore((s) => s.openModal);
  const location = useLocation();
  const navigate = useNavigate();
  const [bannerDismissed, setBannerDismissed] = useState(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem(LEARN_BANNER_DISMISSED_KEY) === '1'
  );

  useEffect(() => {
    const scrollTo = (location.state as { scrollToLessonNumber?: number } | null)?.scrollToLessonNumber;
    if (scrollTo == null) return;
    const sectionId = getSectionIdForLessonNumber(scrollTo);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    try {
      localStorage.setItem(LEARN_BANNER_DISMISSED_KEY, '1');
    } catch {}
  };

  const showBanner = !isAuthenticated && !bannerDismissed;
  const hasPro = user?.isPro === true;

  const handleUpgradeToPro = () => {
    openModal('register', { context: 'progress' });
  };

  return (
    <div>
      <PageHeader
        title="Learn the Basics"
        subtitle="From the rules of the game to advanced beginner concepts. New to chess? Start with the first six lessons."
      />
      {showBanner && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-card border border-primary-200 bg-primary-50 px-4 py-3">
          <p className="text-body-sm text-primary-800">
            Sign in to save your progress across devices.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openModal('register', { context: 'progress' })}
              className="rounded-button bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => openModal('login', { context: 'progress' })}
              className="rounded-button border border-primary-300 px-3 py-1.5 text-sm font-semibold text-primary-800 hover:bg-primary-100 transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={handleDismissBanner}
              aria-label="Dismiss"
              className="rounded p-1 text-primary-500 hover:text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <section id="learn-section-new" className="mb-10">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-h2 font-bold text-primary-900">New to Chess</h2>
          <span className="text-body text-text-muted shrink-0">Rating 0 – 400</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {newToChess.map((lesson) => {
            const progress = getProgress(lesson.id);
            const colorClass = colorClasses[lesson.number] ?? 'bg-primary-700';
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progress}
                colorClass={colorClass}
                action={
                  <Link
                    to={`/learn/${lesson.id}`}
                    className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-semibold border border-primary-200 text-primary-800 hover:bg-primary-50 transition-colors"
                  >
                    {progress.completed ? 'Review Lesson' : progress.started ? 'Continue' : 'Start Lesson'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                }
              />
            );
          })}
        </div>
      </section>

      {beginner.length > 0 && (
        <section id="learn-section-beginner" className="mb-10">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-h2 font-bold text-primary-900">Beginner Concepts</h2>
            <span className="text-body text-text-muted shrink-0">Rating 400 – 600</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {beginner.map((lesson) => {
              const progress = getProgress(lesson.id);
              const colorClass = colorClasses[lesson.number] ?? 'bg-primary-700';
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={progress}
                  colorClass={colorClass}
                  action={
                    <Link
                      to={`/learn/${lesson.id}`}
                      className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-semibold border border-primary-200 text-primary-800 hover:bg-primary-50 transition-colors"
                    >
                      {progress.completed ? 'Review Lesson' : progress.started ? 'Continue' : 'Start Lesson'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {advancedBeginner.length > 0 && (
        <section id="learn-section-advanced">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-h2 font-bold text-primary-900">Advanced Beginner Concepts</h2>
            <span className="text-body text-text-muted shrink-0">Rating 600 – 800</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {advancedBeginner.map((lesson) => {
              const progress = getProgress(lesson.id);
              const colorClass = colorClasses[lesson.number] ?? 'bg-primary-700';
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={progress}
                  colorClass={colorClass}
                  action={
                    hasPro ? (
                      <Link
                        to={`/learn/${lesson.id}`}
                        className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-semibold border border-primary-200 text-primary-800 hover:bg-primary-50 transition-colors"
                      >
                        {progress.completed ? 'Review Lesson' : progress.started ? 'Continue' : 'Start Lesson'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleUpgradeToPro}
                        className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity"
                      >
                        Upgrade to Pro
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
