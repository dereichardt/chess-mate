import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import AppLogo from '../ui/AppLogo'

interface HeaderProps {
  transparent?: boolean
}

export default function Header({ transparent = false }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, openModal } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?'

  return (
    <header
      className={`sticky top-0 z-20 transition-colors duration-300 ${
        transparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-surface border-b border-border shadow-header'
      }`}
    >
      <div className="mx-auto px-6 md:px-10 py-4 flex justify-between items-center max-w-7xl">
        <Link
          to={isAuthenticated ? '/home' : '/'}
          className={`flex items-center gap-2.5 hover:opacity-80 transition ${
            transparent ? 'text-white' : 'text-primary-900'
          }`}
        >
          <AppLogo size={26} />
          <span className="text-xl font-semibold tracking-tight">Chess-Mate</span>
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className={`text-body font-medium transition py-1 ${
                  transparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Log out
              </button>
              <Link
                to="/profile"
                title={`View profile: ${user?.username}`}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  transparent
                    ? 'bg-white text-primary-900 focus:ring-white focus:ring-offset-primary-700'
                    : 'bg-primary-800 text-white focus:ring-primary-500'
                }`}
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal('login')}
                className={`text-body font-medium transition py-2 ${
                  transparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-primary-800 hover:text-primary-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => openModal('register')}
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-button font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                  transparent
                    ? 'bg-white text-primary-900 hover:bg-white/90 focus:ring-white'
                    : 'bg-primary-800 text-white hover:bg-primary-900 focus:ring-primary-500 shadow-card'
                }`}
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
