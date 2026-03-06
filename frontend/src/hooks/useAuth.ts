import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      fetchUser()
    }
  }, [user, fetchUser])

  return {
    user,
    isAuthenticated,
    isLoading,
  }
}
