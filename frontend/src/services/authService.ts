import api from './api'
import { AuthResponse, User } from '../types/user'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    localStorage.setItem('token', data.token)
    return data
  },

  async register(
    email: string,
    password: string,
    username: string
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      username,
    })
    localStorage.setItem('token', data.token)
    return data
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
}
