import type { ReactNode } from 'react'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClass: Record<BadgeVariant, string> = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  outline: 'badge-outline',
}

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  return (
    <span className={['badge', variantClass[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}

interface ChipProps {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
  'aria-pressed'?: boolean
}

export function Chip({ active, onClick, children, className = '', ...props }: ChipProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-pressed={active}
      onClick={onClick}
      className={['chip', active ? 'active' : '', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
