import { create } from 'zustand'
import { User } from '../types/user'
import { authService } from '../services/authService'
import { useProgressStore } from './progressStore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  modalOpen: boolean
  modalMode: 'login' | 'register'
  modalContext: 'progress' | null
  openModal: (mode: 'login' | 'register', options?: { context?: 'progress' }) => void
  closeModal: () => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  modalOpen: false,
  modalMode: 'login',
  modalContext: null,

  openModal: (mode, options) => set({
    modalOpen: true,
    modalMode: mode,
    modalContext: options?.context ?? null,
  }),
  closeModal: () => set({ modalOpen: false, modalContext: null }),

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { user } = await authService.login(email, password)
      set({ user, isAuthenticated: true, isLoading: false, modalOpen: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true })
    try {
      const { user } = await authService.register(email, password, username)
      set({ user, isAuthenticated: true, isLoading: false, modalOpen: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    await authService.logout()
    useProgressStore.getState().clear()
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    set({ isLoading: true })
    try {
      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
