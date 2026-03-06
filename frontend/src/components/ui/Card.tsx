import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  elevated?: boolean
}

export default function Card({ children, className = '', elevated = false }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-card p-6 ${elevated ? 'shadow-elevated' : 'shadow-card'} ${className}`}
    >
      {children}
    </div>
  )
}
