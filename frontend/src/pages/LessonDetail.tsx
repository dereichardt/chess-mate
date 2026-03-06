import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessons } from '../data/lessons';
import ChessBoard, { SQUARE_COLORS } from '../components/chess/ChessBoard';
import LessonNarration from '../components/lesson/LessonNarration';
import { useProgress } from '../hooks/useProgress';
import { useAuthStore } from '../store/authStore';
import { isPremiumLesson } from '../utils/lessons';

function BoardLegend({ showClickToSelect = false }: { showClickToSelect?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-end mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-700 transition-colors"
        aria-label="Board legend"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        Board guide
      </button>

      {open && (
        <div className="absolute bottom-7 right-0 z-20 w-72 bg-white rounded-card shadow-elevated border border-border p-4 text-sm">
          <p className="font-semibold text-primary-900 mb-3">Board indicators</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: SQUARE_COLORS.yellowExplanation, border: '1px solid rgba(250, 204, 21, 0.8)' }} />
              <span className="text-primary-700">Yellow — lesson highlight (explanation / key squares)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: SQUARE_COLORS.lightGreenMovedFrom, border: '1px solid rgba(34, 197, 94, 0.5)' }} />
              <span className="text-primary-700">Light green — square the piece moved from</span>
            </div>

            {showClickToSelect ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: SQUARE_COLORS.selectedPiece, border: '1px solid rgba(250, 204, 21, 0.9)' }} />
                  <span className="text-primary-700">Gold — selected piece</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded shrink-0 flex items-center justify-center bg-white border border-primary-200">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4" fill="rgba(80,80,80,0.35)" />
                    </svg>
                  </span>
                  <span className="text-primary-700">Legal moves — grey dots (click a piece to show)</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: SQUARE_COLORS.greenLegal, border: '1px solid rgba(34, 197, 94, 0.6)' }} />
                <span className="text-primary-700">Green — legal moves (where the piece can go)</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: SQUARE_COLORS.redCapture, border: '1px solid rgba(239, 68, 68, 0.5)' }} />
              <span className="text-primary-700">Red — capture or attack square</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded shrink-0 flex items-center justify-center">
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path d="M1 4h11" stroke="rgba(34,197,94,0.85)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 1l4 3-4 3" stroke="rgba(34,197,94,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-primary-700">Arrow — piece influence or movement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const lesson = lessons.find((l) => l.id === lessonId);

  const { markStarted, markCompleted, setLastStep, getProgress } = useProgress();
  const progress = lesson ? getProgress(lesson.id) : null;

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [challengeState, setChallengeState] = useState<'idle' | 'solved' | 'failed'>('idle');
  const [lastSolvedResult, setLastSolvedResult] = useState<{
    fen: string;
    movedFrom: string;
    arrows?: [string, string, string][];
    captureSquares?: string[];
  } | null>(null);
  const [boardKey, setBoardKey] = useState(0);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [narrationUrls, setNarrationUrls] = useState<(string | null)[]>([]);
  const [narrationLoading, setNarrationLoading] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const openModal = useAuthStore((s) => s.openModal);
  const [lessonBannerDismissed, setLessonBannerDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('chess-mate-lesson-banner-dismissed') === '1';
    } catch {
      return false;
    }
  });
  const showLessonBanner = !isAuthenticated && !lessonBannerDismissed;

  useEffect(() => {
    if (!lesson) return;
    markStarted(lesson.id); // syncs to API when logged in
    const saved = getProgress(lesson.id).lastStep;
    if (saved > 0 && saved < lesson.steps.length) {
      setCurrentStep(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  useEffect(() => {
    if (!lesson) return;

    const stepCount = lesson.steps.length;
    setNarrationLoading(true);
    setNarrationUrls(Array(stepCount).fill(null));

    let cancelled = false;

    (async () => {
      const urls: (string | null)[] = Array(stepCount).fill(null);
      try {
        for (let index = 0; index < stepCount; index++) {
          if (cancelled) break;
          try {
            const resp = await fetch(`/api/lessons/${lesson.id}/narration?stepIndex=${index}`);
            if (!resp.ok) {
              throw new Error(`Narration fetch failed for step ${index}`);
            }
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            urls[index] = url;
            if (!cancelled) {
              setNarrationUrls((prev) => {
                const next = prev.length === stepCount ? [...prev] : Array(stepCount).fill(null);
                next[index] = url;
                return next;
              });
            } else {
              URL.revokeObjectURL(url);
            }
          } catch (stepError) {
            // eslint-disable-next-line no-console
            console.error('Lesson narration preload error for step', index, stepError);
          }
        }
      } finally {
        if (!cancelled) {
          setNarrationLoading(false);
        } else {
          urls.forEach((url) => {
            if (url) URL.revokeObjectURL(url);
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      setNarrationUrls((prev) => {
        prev.forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
        return [];
      });
    };
  }, [lesson?.id]);

  // Scroll so board and nav are in view when opening a lesson or changing step.
  useEffect(() => {
    if (!lesson) return;
    const timer = requestAnimationFrame(() => {
      mainContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(timer);
  }, [lesson?.id, currentStep]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-primary-700 text-lg">Lesson not found.</p>
        <Link to="/learn" className="text-accent-600 hover:underline font-medium">
          ← Back to Lessons
        </Link>
      </div>
    );
  }

  const hasPro = user?.isPro === true;
  if (isPremiumLesson(lesson) && !hasPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 px-4">
        <div className="max-w-md rounded-card border border-border bg-surface shadow-card p-8 text-center">
          <h2 className="text-h2 font-bold text-primary-900 mb-2">Pro Lesson</h2>
          <p className="text-body text-text-muted mb-6">
            This lesson is part of the Pro curriculum. Upgrade to Pro to unlock all Advanced Beginner lessons and support Chess-Mate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => openModal('register', { context: 'progress' })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity"
            >
              Upgrade to Pro
            </button>
            <Link
              to="/learn"
              state={{ scrollToLessonNumber: lesson.number }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-sm font-semibold border border-primary-200 text-primary-800 hover:bg-primary-50 transition-colors"
            >
              ← Back to Lessons
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = Math.max(0, lesson.steps.length);
  // Guard against out-of-bounds currentStep (e.g. from stale progress) so step is always defined
  const safeStepIndex = totalSteps > 0 ? Math.min(Math.max(0, currentStep), totalSteps - 1) : 0;
  const step = totalSteps > 0 ? lesson.steps[safeStepIndex] : null;

  useEffect(() => {
    if (!lesson || totalSteps === 0) return;
    if (currentStep < 0 || currentStep >= totalSteps) {
      setCurrentStep(safeStepIndex);
    }
  }, [lesson?.id, totalSteps, currentStep, safeStepIndex]);

  const isFirst = safeStepIndex === 0;
  const isLast = safeStepIndex === totalSteps - 1;
  // Challenge steps block forward navigation until the correct move is found.
  const isNextBlocked = step ? !!step.challenge && challengeState !== 'solved' : false;
  // Click-to-select + legal move dots for interactive steps (lessons 2+; reusable for puzzles/opening study).
  const showClickToSelectLegalMoves =
    lesson.number >= 2 &&
    (step?.interactive ?? false) &&
    !(step?.challenge && challengeState === 'solved');

  if (totalSteps === 0 || !step) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-primary-700 text-lg">This lesson has no steps yet.</p>
        <Link
          to="/learn"
          state={{ scrollToLessonNumber: lesson.number }}
          className="text-accent-600 hover:underline font-medium"
        >
          ← Back to Lessons
        </Link>
      </div>
    );
  }

  const clearResetTimeout = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  };

  const handlePrev = () => {
    clearResetTimeout();
    const next = currentStep - 1;
    setCurrentStep(next);
    setLastStep(lesson.id, next, lesson.steps.length);
    setChallengeState('idle');
    setLastSolvedResult(null);
  };

  const handleNext = () => {
    clearResetTimeout();
    const next = currentStep + 1;
    setCurrentStep(next);
    setLastStep(lesson.id, next, lesson.steps.length);
    setChallengeState('idle');
    setLastSolvedResult(null);
  };

  const handleChallengeResult = useCallback(
    (
      solved: boolean,
      result?: {
        fen: string;
        movedFrom: string;
        arrows?: [string, string, string][];
        captureSquares?: string[];
      },
    ) => {
    if (solved) {
      setLastSolvedResult(result ?? null);
      clearResetTimeout();
      setChallengeState('solved');
    } else {
      setLastSolvedResult(null);
      setChallengeState('failed');
      clearResetTimeout();
      resetTimeoutRef.current = setTimeout(() => {
        setBoardKey((k) => k + 1);
        setChallengeState('idle');
      }, 1500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = () => {
    markCompleted(lesson.id);
    navigate('/learn', { state: { scrollToLessonNumber: lesson.number } });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/learn"
          state={lesson ? { scrollToLessonNumber: lesson.number } : undefined}
          className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lessons
        </Link>

        <div className="flex items-center gap-3">
          {progress?.completed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          )}
          <span className="text-sm text-primary-500 font-medium tabular-nums">
            Step {safeStepIndex + 1} of {totalSteps}
          </span>
        </div>
      </div>

      {showLessonBanner && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-card border border-primary-200 bg-primary-50 px-4 py-2.5">
          <p className="text-body-sm text-primary-800">
            Create an account to save your progress.
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
              onClick={() => {
                setLessonBannerDismissed(true);
                try {
                  sessionStorage.setItem('chess-mate-lesson-banner-dismissed', '1');
                } catch {}
              }}
              className="rounded-button border border-primary-300 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Lesson title */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-1">
          Lesson {lesson.number}
        </p>
        <h1 className="text-2xl font-bold text-primary-900">{lesson.title}</h1>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1.5 mb-8">
        {lesson.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              clearResetTimeout();
              setCurrentStep(i);
              setLastStep(lesson.id, i, lesson.steps.length);
              setChallengeState('idle');
              setLastSolvedResult(null);
            }}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < safeStepIndex
                ? 'bg-accent'
                : i === safeStepIndex
                ? 'bg-primary-800'
                : 'bg-primary-200'
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Main content — ref for scroll-into-view */}
      <div ref={mainContentRef} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        {/* Chess board — 3/5 width on large screens */}
        <div className="lg:col-span-3 flex items-start justify-center">
          <div className="w-full max-w-[560px] relative">
            <ChessBoard
              key={`${safeStepIndex}-${boardKey}-${challengeState}`}
              fen={
                (challengeState === 'solved' && (step.postChallenge?.fen ?? lastSolvedResult?.fen))
                  ? (step.postChallenge?.fen ?? lastSolvedResult?.fen ?? step.fen)
                  : step.fen
              }
              highlightSquares={step.postChallenge && challengeState === 'solved' ? step.postChallenge.highlightSquares : step.highlightSquares}
              captureSquares={
                challengeState === 'solved'
                  ? (step.postChallenge?.captureSquares ?? lastSolvedResult?.captureSquares ?? step.captureSquares)
                  : step.captureSquares
              }
              fillSquares={step.postChallenge && challengeState === 'solved' ? step.postChallenge.fillSquares : step.fillSquares}
              arrows={
                challengeState === 'solved'
                  ? (step.postChallenge?.arrows ?? lastSolvedResult?.arrows ?? step.arrows)
                  : step.arrows
              }
              movedFromSquare={
                challengeState === 'solved' ? (step.postChallenge?.movedFrom ?? lastSolvedResult?.movedFrom) : undefined
              }
              correctMove={step.challenge}
              onChallengeResult={handleChallengeResult}
              interactive={step.interactive !== false && !(step.challenge && challengeState === 'solved')}
              showClickToSelectLegalMoves={showClickToSelectLegalMoves}
            />
            {/* Board-area callout: correct/wrong feedback anchored to board */}
            {step.challenge && (challengeState === 'solved' || challengeState === 'failed') && (
              <div
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-3 py-2 rounded-lg shadow-elevated text-sm font-semibold flex items-center gap-2 ${
                  challengeState === 'solved'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {challengeState === 'solved' && (
                  <>
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Correct! Well played.
                  </>
                )}
                {challengeState === 'failed' && (
                  <>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Try again!
                  </>
                )}
              </div>
            )}
            <BoardLegend showClickToSelect={showClickToSelectLegalMoves} />
          </div>
        </div>

        {/* Step content + navigation — 2/5 width on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className={`bg-white rounded-card shadow-card p-6 flex-1 flex flex-col ${
              step.challenge || step.interactive
                ? 'ring-2 ring-accent-300 border-accent-200'
                : ''
            }`}
          >
            {/* Step-type label inside card, above title */}
            <div className="mb-3">
              {step.challenge ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Your turn
                </span>
              ) : step.interactive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Try it
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-primary-900 mb-3">{step.title}</h2>
            <div className="space-y-3 flex-1">
              {step.text.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-primary-700 leading-relaxed text-sm">
                  {paragraph.split('\n').map((line, j, arr) => (
                    <span key={j}>
                      {line.split(/(\*\*[^*]+\*\*)/).map((chunk, k) =>
                        chunk.startsWith('**') && chunk.endsWith('**')
                          ? <strong key={k}>{chunk.slice(2, -2)}</strong>
                          : chunk
                      )}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            {/* Interactive indicator (challenge steps) — just above narration so both sit at bottom of card */}
            {step.challenge && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2.5 text-sm font-medium text-primary-700">
                <svg className="w-4 h-4 shrink-0 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Find the move — drag the right piece.
              </div>
            )}

            <LessonNarration
              audioUrl={narrationUrls[safeStepIndex]}
              isPreloading={narrationLoading}
            />
          </div>

          {/* Navigation — sits below the text card, aligned with the board bottom */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className="flex items-center gap-2 px-4 py-2 rounded-button text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {isLast ? (
              <button
                onClick={handleComplete}
                disabled={isNextBlocked}
                style={isNextBlocked ? undefined : { backgroundColor: '#e07b39', color: '#fff' }}
                className="flex items-center gap-2 px-5 py-2 rounded-button text-sm font-semibold shadow-card transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Complete Lesson
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isNextBlocked}
                style={isNextBlocked ? undefined : { backgroundColor: '#1a3a5c', color: '#fff' }}
                className="flex items-center gap-2 px-5 py-2 rounded-button text-sm font-semibold shadow-card transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
