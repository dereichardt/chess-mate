import { Link, useLocation } from 'react-router-dom'
import { IconHome, IconLearn, IconOpenings, IconPuzzles } from '../ui/FeatureIcons'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { path: '/home',      label: 'Home',             icon: <IconHome /> },
  { path: '/learn',    label: 'Learn the Basics', icon: <IconLearn /> },
  { path: '/openings', label: 'Study Openings',   icon: <IconOpenings /> },
  { path: '/puzzles',  label: 'Solve Puzzles',    icon: <IconPuzzles /> },
]

export default function Sidebar() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const items = navItems.filter((item) => item.path !== '/home' || isAuthenticated)

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen flex flex-col">
      <nav className="flex-1 py-4 px-4 space-y-1 pt-6">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-card text-body transition ${
              location.pathname === item.path
                ? 'bg-primary-50 text-primary-900 font-semibold border-l-2 border-accent'
                : 'text-text hover:bg-surface-muted'
            }`}
          >
            <span className="shrink-0" aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
