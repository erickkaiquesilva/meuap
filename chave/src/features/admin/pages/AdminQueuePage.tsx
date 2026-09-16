import { ListingReviewCard } from '../components/ListingReviewCard/ListingReviewCard'
import {
  useApproveListing,
  useModerationQueue,
  useRejectListing,
} from '../hooks/useModerationQueue'
import { Button } from '@/shared/components/Button/Button'
import styles from './AdminQueuePage.module.css'

export function AdminQueuePage() {
  const { data, isLoading, isError, refetch, isFetching } = useModerationQueue()
  const approve = useApproveListing()
  const reject = useRejectListing()
  const listings = data ?? []

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Fila de moderação</h1>
        <p className={styles.sub}>Anúncios aguardando aprovação antes de ir ao ar.</p>
      </header>

      {isLoading || (isFetching && listings.length === 0) ? (
        <p className={styles.state}>Carregando fila…</p>
      ) : null}

      {isError ? (
        <div className={styles.state}>
          <p>Não foi possível carregar a fila.</p>
          <Button type="button" variant="outline" onClick={() => { void refetch() }}>
            Tentar de novo
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && listings.length === 0 ? (
        <p className={styles.state}>Nenhum anúncio na fila.</p>
      ) : null}

      {!isError && listings.length > 0 ? (
        <ul className={styles.list}>
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingReviewCard
                listing={listing}
                onApprove={(id) => approve.mutateAsync(id)}
                onReject={(id, reason) => reject.mutateAsync({ id, reason })}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
