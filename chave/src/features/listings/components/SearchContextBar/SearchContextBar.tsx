import { SortSelect } from '../SortSelect/SortSelect'
import styles from './SearchContextBar.module.css'

interface SearchContextBarProps {
  locationLabel: string
  total: number
  isLoading: boolean
  resultNoun: string
  sort: string
  onSortChange: (val: string) => void
}

export function SearchContextBar({
  locationLabel,
  total,
  isLoading,
  resultNoun,
  sort,
  onSortChange,
}: SearchContextBarProps) {
  function handleAlertClick() {
    // Stub — backend alert subscription comes in a later story
    window.alert('Em breve você poderá criar alertas para esta busca.')
  }

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <h1 className={styles.location}>{locationLabel}</h1>
        <p className={styles.count} aria-live="polite">
          {isLoading ? (
            'Buscando imóveis…'
          ) : (
            <>
              <strong>{total}</strong>{' '}
              {total === 1 ? `${resultNoun} encontrado` : `${resultNoun}s encontrados`}
            </>
          )}
        </p>
      </div>

      <div className={styles.right}>
        <SortSelect value={sort} onChange={onSortChange} />
        <button
          type="button"
          className={`btn btn-outline btn-sm ${styles.alertBtn}`}
          onClick={handleAlertClick}
        >
          <BellIcon />
          Criar alerta
        </button>
      </div>
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
