import { useNavigate } from 'react-router-dom'
import { MyListingsGrid } from '../components/MyListingsGrid/MyListingsGrid'
import { useMyListings } from '../hooks/useMyListings'
import { Button } from '@/shared/components/Button/Button'
import styles from './AnnouncerDashboardPage.module.css'

export function AnnouncerDashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch, isFetching } = useMyListings()
  const listings = data ?? []

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Meus anúncios</h1>
          <p className={styles.sub}>Gerencie os imóveis que você publicou na Chave.</p>
        </div>
        {listings.length > 0 && !isLoading && !isError ? (
          <Button type="button" onClick={() => navigate('/anuncios/novo')}>
            Novo anúncio
          </Button>
        ) : null}
      </header>

      <MyListingsGrid
        listings={listings}
        isLoading={isLoading || (isFetching && listings.length === 0)}
        isError={isError}
        onRetry={() => { void refetch() }}
        onCreate={() => navigate('/anuncios/novo')}
      />
    </div>
  )
}
