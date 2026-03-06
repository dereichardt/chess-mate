import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

interface StatCardProps {
  value: string
  label: string
  detail?: string
  colorClass: string
}

function StatCard({ value, label, detail, colorClass }: StatCardProps) {
  return (
    <Card>
      <div className={`w-10 h-1.5 rounded-pill mb-4 ${colorClass}`} />
      <p
        className="font-extrabold text-primary-900 mb-1"
        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
      >
        {value}
      </p>
      <p className="text-body font-semibold text-text mb-0.5">{label}</p>
      {detail && <p className="text-caption text-text-muted">{detail}</p>}
    </Card>
  )
}

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?'

  return (
    <div>
      {/* Profile identity */}
      <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border">
        <div className="w-14 h-14 rounded-full bg-primary-800 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initial}
        </div>
        <div>
          <h1 className="text-h1 font-bold text-primary-900">{user?.username ?? 'Your Profile'}</h1>
          <p className="text-body text-text-muted">{user?.email ?? ''}</p>
        </div>
      </div>

      <PageHeader
        title="Your Progress"
        subtitle="Track your improvement across puzzles, openings, and lessons."
      />

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          value="—"
          label="Puzzles Solved"
          detail="Start solving to see your count"
          colorClass="bg-accent"
        />
        <StatCard
          value="—"
          label="Accuracy"
          detail="Correct on first attempt"
          colorClass="bg-success"
        />
        <StatCard
          value="—"
          label="Openings Studied"
          detail="Lessons started or completed"
          colorClass="bg-primary-600"
        />
      </div>

      <Card className="mb-8">
        <h2 className="text-h3 font-bold text-primary-900 mb-4">Recent Activity</h2>
        <p className="text-body text-text-muted">
          Complete your first puzzle or lesson to see activity here.
        </p>
      </Card>

      {/* Logout */}
      <div className="pt-2">
        <Button variant="danger" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  )
}
