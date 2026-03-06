export interface User {
  id: string
  email: string
  username: string
  rating?: number
  createdAt: string
  /** True when user has an active Pro subscription. Stub: always false until Stripe is integrated. */
  isPro?: boolean
}

export interface AuthResponse {
  user: User
  token: string
}
