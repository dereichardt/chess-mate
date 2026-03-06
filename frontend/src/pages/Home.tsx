import type React from 'react'
import { Link } from 'react-router-dom'
import { IconLearn, IconOpenings, IconPuzzles } from '../components/ui/FeatureIcons'

/* ─────────────────────────────────────────────────────────────────
   Section 1 — Hero
   Full-bleed dark navy with diagonal gradient, transparent header
   overlays it thanks to HomeLayout.
───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{
        minHeight: '580px',
        background: 'linear-gradient(135deg, #0a1929 0%, #1a3a5c 60%, #243b53 100%)',
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 pt-36 pb-24">
        {/* Headline */}
        <h1
          className="text-white font-extrabold mb-6 leading-[1.08]"
          style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', letterSpacing: '-0.02em' }}
        >
          Get better at chess.<br />
          <span className="text-white/80">One move at a time.</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/60 text-body-lg max-w-xl">
          Sharpen your tactics with hundreds of puzzles, master critical openings,
          and track your progress — all in one focused app.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Section 2 — Feature Cards
   Three large cards with a color bar, icon, description, arrow link.
───────────────────────────────────────────────────────────────── */
interface FeatureCardProps {
  colorBar: string
  icon: React.ReactNode
  title: string
  description: string
  href: string
  linkLabel: string
}

function FeatureCard({ colorBar, icon, title, description, href, linkLabel }: FeatureCardProps) {
  return (
    <Link
      to={href}
      className="group flex flex-col bg-surface rounded-card-lg shadow-card hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {/* Color bar */}
      <div className={`h-1.5 w-full ${colorBar}`} />

      <div className="flex flex-col flex-1 p-8">
        {/* Icon */}
        <div className="w-12 h-12 rounded-card flex items-center justify-center mb-5 text-primary-700 bg-primary-50 group-hover:scale-105 transition-transform duration-200">
          {icon}
        </div>

        {/* Text */}
        <h2 className="text-h3 font-bold text-primary-900 mb-2">{title}</h2>
        <p className="text-body text-text-muted flex-1">{description}</p>

        {/* Arrow link */}
        <span className="mt-6 inline-flex items-center gap-1.5 text-caption font-semibold text-primary-700 group-hover:text-accent transition-colors">
          {linkLabel}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}


function FeatureCards() {
  const cards: FeatureCardProps[] = [
    {
      colorBar: 'bg-primary-600',
      icon: <IconLearn />,
      title: 'Learn the Basics',
      description:
        'New to chess? Start from the ground up. Six structured lessons take you from how the pieces move to your first tactical ideas.',
      href: '/learn',
      linkLabel: 'Start Learning',
    },
    {
      colorBar: 'bg-primary-800',
      icon: <IconOpenings />,
      title: 'Study Openings',
      description:
        'Build a reliable repertoire with 50+ lines covering the most critical systems — with explanations of the ideas behind every move.',
      href: '/openings',
      linkLabel: 'Study Openings',
    },
    {
      colorBar: 'bg-primary-800',
      icon: <IconPuzzles />,
      title: 'Solve Puzzles',
      description:
        'Train pattern recognition with 500+ hand-curated puzzles spanning forks, pins, skewers, and more. Sharpen your calculation one move at a time.',
      href: '/puzzles',
      linkLabel: 'Solve Puzzles',
    },
  ]

  return (
    <section className="bg-surface-subtle py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10">
          <h2 className="text-h1 font-bold text-primary-900 mb-2">Everything you need to improve</h2>
          <p className="text-body-lg text-text-muted max-w-xl">
            Three focused sections designed to take you from beginner to confident player.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card) => (
            <FeatureCard key={card.href} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Section 3 — Stats Strip
   Three bold numbers, light muted background. Workday-style credibility.
───────────────────────────────────────────────────────────────── */
interface StatProps {
  number: string
  label: string
}

function Stat({ number, label }: StatProps) {
  return (
    <div className="text-center px-6">
      <p
        className="font-extrabold text-primary-900 mb-1"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
      >
        {number}
      </p>
      <p className="text-body text-text-muted font-medium">{label}</p>
    </div>
  )
}

function StatsStrip() {
  return (
    <section className="bg-surface border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 sm:divide-x sm:divide-border">
          <Stat number="500+" label="Curated puzzles" />
          <Stat number="50+" label="Opening lines" />
          <Stat number="10,000+" label="Moves analyzed" />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Page root
───────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <StatsStrip />
    </>
  )
}
