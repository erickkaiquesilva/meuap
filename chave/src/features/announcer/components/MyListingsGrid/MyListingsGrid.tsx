import type { MyListing } from '../../types/listings'
import { MyListingCard } from '../MyListingCard/MyListingCard'
import { Button } from '@/shared/components/Button/Button'
import styles from './MyListingsGrid.module.css'

interface MyListingsGridProps {
  listings: MyListing[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onCreate: () => void
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

export function MyListingsGrid({
  listings,
  isLoading,
  isError,
  onRetry,
  onCreate,
}: MyListingsGridProps) {
  if (isError) {
    return (
      <div className={styles.state} role="alert">
        <p className={styles.stateTitle}>Erro ao carregar seus anúncios</p>
        <p className={styles.stateSub}>Verifique a conexão e tente de novo.</p>
        <Button type="button" variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Carregando anúncios">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className={styles.empty}>
        <strong className={styles.stateTitle}>Você ainda não tem anúncios</strong>
        <p className={styles.stateSub}>
          Publique o primeiro imóvel e acompanhe tudo por aqui.
        </p>
        <Button type="button" onClick={onCreate}>
          Fazer meu primeiro anúncio
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.grid} aria-live="polite">
      {listings.map((listing) => (
        <MyListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
