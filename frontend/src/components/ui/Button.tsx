import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-button font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
  const variantClasses = {
    primary: 'bg-primary-800 text-text-inverse hover:bg-primary-900',
    secondary: 'bg-surface-muted text-text border border-border hover:bg-border',
    ghost: 'text-text hover:bg-surface-muted',
    danger: 'bg-error text-text-inverse hover:opacity-90',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
