import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline'
type ButtonSize = 'default' | 'sm' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  'danger-outline': 'btn-danger-outline',
}

const sizeClass: Record<ButtonSize, string> = {
  default: '',
  sm: 'btn-sm',
  icon: 'btn-icon',
}

export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = ['btn', variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="btn-loading-spinner" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  )
}
