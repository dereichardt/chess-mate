import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import { lessons } from '../data/lessons'
import type { Lesson } from '../data/lessons'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore } from '../store/authStore'
import { IconLearn, IconOpenings, IconPuzzles } from '../components/ui/FeatureIcons'

/** First lesson not completed, or first lesson if all complete (for "Review"). */
function getNextLesson(
  lessonsList: Lesson[],
  getProgress: (id: string) => { completed: boolean; started: boolean }
): { lesson: Lesson; label: 'Continue' | 'Start' | 'Review' } {
  const next = lessonsList.find((l) => !getProgress(l.id).completed) ?? lessonsList[0]
  const allComplete = lessonsList.every((l) => getProgress(l.id).completed)
  const progress = getProgress(next.id)
  const label = allComplete ? 'Review' : progress.started ? 'Continue' : 'Start'
  return { lesson: next, label }
}

function WelcomeSection() {
  const user = useAuthStore((s) => s.user)
  const username = user?.username ?? 'there'
  return (
    <section className="mb-8">
      <h1 className="text-h1 font-bold text-primary-900">
        Welcome back, {username}
      </h1>
      <p className="text-body-lg text-text-muted mt-1">
        Pick up where you left off or explore something new.
      </p>
    </section>
  )
}

function ContinueLearningSection() {
  const getProgress = useProgressStore((s) => s.getProgress)
  const hasInProgress = lessons.some((l) => {
    const p = getProgress(l.id)
    return p.started && !p.completed
  })
  if (!hasInProgress) return null

  const { lesson, label } = getNextLesson(lessons, getProgress)
  return (
    <section className="mb-10">
      <h2 className="text-h2 font-bold text-primary-900 mb-4">Continue learning</h2>
      <Link to={`/learn/${lesson.id}`} className="block group">
        <Card className="flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 border-l-primary-600 hover:shadow-elevated transition-shadow">
          <div className="flex-1 min-w-0">
            <p className="text-caption font-semibold text-primary-600 uppercase tracking-wide mb-1">
              {label}
            </p>
            <h3 className="text-h3 font-bold text-primary-900 group-hover:text-primary-700 transition-colors">
              {lesson.title}
            </h3>
            <p className="text-body text-text-muted mt-1">{lesson.description}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button text-sm font-semibold bg-primary-800 text-white shrink-0 group-hover:bg-primary-900 transition-colors">
            {label === 'Review' ? 'Review Lesson' : label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Card>
      </Link>
    </section>
  )
}

function ProgressSummarySection() {
  const getProgress = useProgressStore((s) => s.getProgress)
  const completedCount = lessons.filter((l) => getProgress(l.id).completed).length
  const total = lessons.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  return (
    <section className="mb-10">
      <h2 className="text-h2 font-bold text-primary-900 mb-4">Your progress</h2>
      <Card>
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-body font-medium text-primary-900">
            Learn the Basics
          </span>
          <span className="text-body font-semibold text-primary-700">
            {completedCount} of {total} lessons
          </span>
        </div>
        <div className="h-2.5 bg-primary-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>
    </section>
  )
}

function QuickLinksSection() {
  const links = [
    {
      href: '/learn',
      icon: <IconLearn />,
      title: 'Learn the Basics',
      description: 'Six lessons from the rules to your first tactical ideas.',
      linkLabel: 'Go to Learn',
      colorBar: 'bg-primary-600',
    },
    {
      href: '/openings',
      icon: <IconOpenings />,
      title: 'Study Openings',
      description: 'Build a repertoire with key opening lines and ideas.',
      linkLabel: 'Go to Openings',
      colorBar: 'bg-primary-800',
    },
    {
      href: '/puzzles',
      icon: <IconPuzzles />,
      title: 'Solve Puzzles',
      description: 'Train pattern recognition with curated puzzles.',
      linkLabel: 'Go to Puzzles',
      colorBar: 'bg-primary-800',
    },
  ]
  return (
    <section>
      <h2 className="text-h2 font-bold text-primary-900 mb-4">Explore</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {links.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group flex flex-col bg-surface rounded-card-lg shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <div className={`h-1.5 w-full ${item.colorBar}`} />
            <div className="flex flex-col flex-1 p-6">
              <div className="w-10 h-10 rounded-card flex items-center justify-center mb-4 text-primary-700 bg-primary-50 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-h3 font-bold text-primary-900 mb-1">{item.title}</h3>
              <p className="text-body-sm text-text-muted flex-1">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-caption font-semibold text-primary-700 group-hover:text-accent transition-colors">
                {item.linkLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/**
 * Authenticated dashboard: continue here, progress summary, quick links.
 * Built as ordered sections so future features (e.g. Flashcards) can be added by inserting a section.
 * Waits for progress hydration so we don't flash "0 of 6" after login.
 */
export default function Dashboard() {
  const hydrationStatus = useProgressStore((s) => s.hydrationStatus)

  if (hydrationStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-body text-text-muted">Loading your progress…</p>
      </div>
    )
  }

  return (
    <div>
      <WelcomeSection />
      <ContinueLearningSection />
      <ProgressSummarySection />
      <QuickLinksSection />
    </div>
  )
}
