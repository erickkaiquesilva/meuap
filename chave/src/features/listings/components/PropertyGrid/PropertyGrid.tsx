import type { Property } from '@/shared/types/property'
import { PropertyCard } from '@/shared/components/PropertyCard/PropertyCard'
import styles from './PropertyGrid.module.css'

interface PropertyGridProps {
  properties: Property[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonPhoto} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.medium}`} />
        <div className={`${styles.skeletonLine} ${styles.short}`} />
        <div className={styles.skeletonLine} />
      </div>
    </div>
  )
}

export function PropertyGrid({ properties, isLoading, isError, onRetry }: PropertyGridProps) {
  if (isError) {
    return (
      <div className={styles.grid}>
        <div className={styles.error}>
          <div className={styles.emptyIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className={styles.errorTitle}>Erro ao carregar imóveis</p>
          <p className={styles.errorSubtitle}>Tente novamente ou ajuste os filtros.</p>
          <button type="button" className="btn btn-outline" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.grid} aria-live="polite" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>Nenhum imóvel encontrado</p>
          <p className={styles.emptySubtitle}>
            Tente ajustar os filtros ou ampliar os critérios de busca.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.grid} aria-live="polite">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
