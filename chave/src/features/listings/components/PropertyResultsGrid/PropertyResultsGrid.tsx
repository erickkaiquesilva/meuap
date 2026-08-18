import type { Property } from '@/shared/types/property'
import { ListingPropertyCard } from '../ListingPropertyCard/ListingPropertyCard'
import styles from './PropertyResultsGrid.module.css'

interface PropertyResultsGridProps {
  properties: Property[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonPhoto} />
      <div className={styles.skeletonLine} />
      <div className={`${styles.skeletonLine} ${styles.short}`} />
    </div>
  )
}

export function PropertyResultsGrid({ properties, isLoading, isError, onRetry }: PropertyResultsGridProps) {
  if (isError) {
    return (
      <div className={styles.state} role="alert">
        <p className={styles.stateTitle}>Erro ao carregar imóveis</p>
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.grid} aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className={styles.state}>
        <p className={styles.stateTitle}>Nenhum imóvel encontrado</p>
        <p className={styles.stateSub}>Ajuste os filtros ou amplie a busca.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid} aria-live="polite">
      {properties.map((p) => (
        <ListingPropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}
