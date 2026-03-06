import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../../store/authStore'
import Button from './Button'

const inputClasses =
  'w-full px-3 py-2 border border-border rounded-input text-body text-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
const labelClasses = 'block text-caption font-medium text-text mb-tight'

export default function AuthModal() {
  const { modalOpen, modalMode, modalContext, closeModal, openModal, login, register, isLoading } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const cardRef = useRef<HTMLDivElement>(null)

  // Reset form state whenever the modal opens or mode changes
  useEffect(() => {
    if (modalOpen) {
      setEmail('')
      setPassword('')
      setUsername('')
      setError('')
    }
  }, [modalOpen, modalMode])

  // Close on Escape key
  useEffect(() => {
    if (!modalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [modalOpen, closeModal])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  if (!modalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (modalMode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, username)
      }
    } catch (err: any) {
      if (modalMode === 'login') {
        setError(err.response?.data?.message || 'Login failed')
      } else {
        setError(
          err.response?.data?.message ||
          (err.code === 'ERR_NETWORK'
            ? 'Cannot reach server. Is the backend running on port 5001?'
            : 'Registration failed'),
        )
      }
    }
  }

  const switchMode = () => {
    openModal(modalMode === 'login' ? 'register' : 'login', { context: modalContext ?? undefined })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeModal}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md bg-white rounded-card shadow-elevated p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close button */}
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-4 right-4 text-primary-400 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-h2 font-semibold text-text text-center mb-6">
          {modalMode === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        {modalContext === 'progress' && (
          <p className="text-body-sm text-text-muted text-center -mt-4 mb-4">
            Create an account to save your progress across devices.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode === 'register' && (
            <div>
              <label className={labelClasses}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClasses}
                required
                autoComplete="username"
              />
            </div>
          )}
          <div>
            <label className={labelClasses}>
              {modalMode === 'login' ? 'Email or username' : 'Email'}
            </label>
            <input
              type={modalMode === 'login' ? 'text' : 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
              autoComplete={modalMode === 'login' ? 'username' : 'email'}
            />
          </div>
          <div>
            <label className={labelClasses}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              required
              autoComplete={modalMode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="text-caption text-error">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? modalMode === 'login' ? 'Logging in...' : 'Creating account...'
              : modalMode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-5 text-center text-body-sm text-text-muted">
          {modalMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-primary-800 hover:text-primary-900 transition-colors"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-primary-800 hover:text-primary-900 transition-colors"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
