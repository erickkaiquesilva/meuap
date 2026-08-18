import type { Property } from '@/shared/types/property'
import { ListingPropertyCard } from '../ListingPropertyCard/ListingPropertyCard'
import styles from './PropertyList.module.css'

interface PropertyListProps {
  properties: Property[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

function SkeletonRow() {
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

export function PropertyList({ properties, isLoading, isError, onRetry }: PropertyListProps) {
  if (isError) {
    return (
      <div className={styles.state} role="alert">
        <p className={styles.stateTitle}>Erro ao carregar imóveis</p>
        <p className={styles.stateSubtitle}>Tente novamente ou ajuste os filtros.</p>
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.list} aria-live="polite" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className={styles.state}>
        <p className={styles.stateTitle}>Nenhum imóvel encontrado</p>
        <p className={styles.stateSubtitle}>
          Tente ajustar os filtros ou ampliar os critérios de busca.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.list} aria-live="polite">
      {properties.map((property) => (
        <ListingPropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
