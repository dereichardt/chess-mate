import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

export default function Puzzles() {
  return (
    <div>
      <PageHeader
        title="Chess Puzzles"
        subtitle="Test your tactical skills with hand-curated puzzles. Spot the winning move."
        action={{ label: 'Start Puzzle', href: '/puzzles' }}
      />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-card bg-error-subtle flex items-center justify-center text-sm font-bold text-error">B</span>
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wide">Beginner</span>
          </div>
          <p className="text-h3 font-bold text-primary-900 mb-1">Forks &amp; Pins</p>
          <p className="text-body text-text-muted">Learn to attack two pieces at once and immobilize key defenders.</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-card bg-warning-subtle flex items-center justify-center text-sm font-bold text-warning">I</span>
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wide">Intermediate</span>
          </div>
          <p className="text-h3 font-bold text-primary-900 mb-1">Skewers &amp; Discoveries</p>
          <p className="text-body text-text-muted">Find hidden attacks and force material gains with discovered checks.</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-card bg-success-subtle flex items-center justify-center text-sm font-bold text-success">A</span>
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wide">Advanced</span>
          </div>
          <p className="text-h3 font-bold text-primary-900 mb-1">Combinations</p>
          <p className="text-body text-text-muted">Multi-move sequences that require deep calculation and precise execution.</p>
        </Card>
      </div>

      <Card elevated>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-bold text-primary-900">Daily Puzzle</h2>
          <span className="text-caption text-text-muted">Updated every 24 hours</span>
        </div>
        <div className="bg-surface-muted rounded-card flex items-center justify-center h-64 mb-4">
          <p className="text-text-muted text-body">Chess board coming soon</p>
        </div>
        <div className="flex gap-3">
          <Button>Start Puzzle</Button>
          <Button variant="secondary">Show Hint</Button>
        </div>
      </Card>
    </div>
  )
}
