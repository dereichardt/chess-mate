import { Link } from 'react-router-dom'
import Button from './Button'

interface PageHeaderAction {
  label: string
  href?: string
  onClick?: () => void
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: PageHeaderAction
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between pb-6 mb-6 border-b border-border">
      <div>
        <h1 className="text-h1 font-bold text-primary-900">{title}</h1>
        {subtitle && (
          <p className="text-body-lg text-text-muted mt-1 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="ml-6 shrink-0">
          {action.href ? (
            <Link
              to={action.href}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-button font-medium text-white bg-primary-800 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-card transition"
            >
              {action.label}
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  )
}
