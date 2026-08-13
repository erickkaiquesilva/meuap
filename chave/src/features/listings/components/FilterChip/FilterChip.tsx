import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import styles from './FilterChip.module.css'

interface FilterChipOption {
  value: string
  label: string
}

interface FilterChipProps {
  label: string
  value?: string
  options: FilterChipOption[]
  active?: boolean
  onChange: (value: string | undefined) => void
  /** When true, selecting the same value clears the filter */
  toggleable?: boolean
}

export function FilterChip({
  label,
  value,
  options,
  active = false,
  onChange,
  toggleable = true,
}: FilterChipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label
  const display = selectedLabel ?? label

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`${styles.chip} ${active || value ? styles.chipActive : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{display}</span>
        <Chevron />
      </button>

      {open && (
        <ul
          id={`${id}-list`}
          className={styles.menu}
          role="listbox"
          aria-labelledby={id}
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              className={styles.option}
              onClick={() => {
                onChange(undefined)
                setOpen(false)
              }}
            >
              Qualquer
            </button>
          </li>
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={value === o.value}>
              <button
                type="button"
                className={`${styles.option} ${value === o.value ? styles.optionActive : ''}`}
                onClick={() => {
                  const next = toggleable && value === o.value ? undefined : o.value
                  onChange(next)
                  setOpen(false)
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface MoreFiltersChipProps {
  children: ReactNode
  activeCount: number
}

export function MoreFiltersChip({ children, activeCount }: MoreFiltersChipProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`${styles.chip} ${activeCount > 0 ? styles.chipActive : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <FilterIcon />
        <span>Mais filtros{activeCount > 0 ? ` (${activeCount})` : ''}</span>
      </button>
      {open && (
        <div className={styles.morePanel} role="dialog" aria-labelledby={id}>
          {children}
          <button type="button" className={`btn btn-primary btn-sm ${styles.applyBtn}`} onClick={() => setOpen(false)}>
            Aplicar
          </button>
        </div>
      )}
    </div>
  )
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}
