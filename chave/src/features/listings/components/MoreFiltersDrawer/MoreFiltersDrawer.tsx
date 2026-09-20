import { useEffect, useId, type ReactNode } from 'react'
import styles from './MoreFiltersDrawer.module.css'

interface MoreFiltersDrawerProps {
  open: boolean
  activeCount: number
  onOpen: () => void
  onClose: () => void
  children: ReactNode
}

export function MoreFiltersDrawer({
  open,
  activeCount,
  onOpen,
  onClose,
  children,
}: MoreFiltersDrawerProps) {
  const id = useId()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <button
        type="button"
        id={id}
        className={`${styles.trigger} ${activeCount > 0 ? styles.triggerActive : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => (open ? onClose() : onOpen())}
      >
        <FilterIcon />
        <span>Mais filtros{activeCount > 0 ? ` (${activeCount})` : ''}</span>
      </button>

      {open ? (
        <>
          <div className={styles.backdrop} aria-hidden="true" onClick={onClose} />
          <aside
            id={`${id}-panel`}
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby={id}
          >
            <header className={styles.head}>
              <h2 className={styles.title}>Filtros</h2>
              <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar filtros">
                ×
              </button>
            </header>
            <div className={styles.body}>{children}</div>
            <footer className={styles.footer}>
              <button type="button" className={`btn btn-primary ${styles.apply}`} onClick={onClose}>
                Ver resultados
              </button>
            </footer>
          </aside>
        </>
      ) : null}
    </>
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
