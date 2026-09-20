import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
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
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; minWidth: number } | null>(null)
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label
  const display = selectedLabel ?? label

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setMenuPos(null)
      return
    }
    function place() {
      const rect = buttonRef.current!.getBoundingClientRect()
      const minWidth = Math.max(rect.width, 180)
      let left = rect.left
      if (left + minWidth > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - minWidth - 8)
      }
      setMenuPos({
        top: rect.bottom + 6,
        left,
        minWidth,
      })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    // Adia o listener para o clique que abriu o menu não fechar na hora.
    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown)
    }, 0)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function select(next: string | undefined) {
    onChange(next)
    setOpen(false)
  }

  const menu = open && menuPos
    ? createPortal(
        <ul
          ref={menuRef}
          id={`${id}-list`}
          className={styles.menu}
          role="listbox"
          aria-labelledby={id}
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            minWidth: menuPos.minWidth,
            zIndex: 200,
          }}
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              className={styles.option}
              onClick={() => select(undefined)}
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
                  select(next)
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>,
        document.body,
      )
    : null

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={buttonRef}
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
      {menu}
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
    const timer = window.setTimeout(() => {
      document.addEventListener('click', onDoc)
    }, 0)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('click', onDoc)
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
