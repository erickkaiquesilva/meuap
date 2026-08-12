import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  disabled?: boolean
  className?: string
  children: ReactNode
}

export function Field({ label, htmlFor, error, disabled, className = '', children }: FieldProps) {
  const classes = ['field', error ? 'error' : '', disabled ? 'disabled' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label htmlFor={htmlFor}>{label}</label>
      <div className="control">{children}</div>
      {error ? <span className="help-error" role="alert">{error}</span> : null}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement>
export function Input(props: InputProps) {
  return <input {...props} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }
export function Select({ children, ...props }: SelectProps) {
  return <select {...props}>{children}</select>
}
