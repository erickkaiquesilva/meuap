import { Link } from 'react-router-dom'
import { useFavoritesList } from '../hooks/useFavorite'
import { PropertyCard } from '@/shared/components/PropertyCard/PropertyCard'
import styles from './FavoritesPage.module.css'

export function FavoritesPage() {
  const { data: favorites = [], isLoading, isError, refetch } = useFavoritesList()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Favoritos</h1>
        <p className={styles.subtitle}>Imóveis salvos na sua conta.</p>
      </header>

      {isLoading ? (
        <p className={styles.status} aria-live="polite" aria-busy="true">
          Carregando favoritos…
        </p>
      ) : null}

      {isError ? (
        <div className={styles.status} role="alert">
          <p>Não foi possível carregar seus favoritos.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => void refetch()}>
            Tentar de novo
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && favorites.length === 0 ? (
        <div className={styles.empty}>
          <p>Você ainda não salvou nenhum imóvel.</p>
          <Link to="/imoveis" className="btn btn-primary">
            Explorar imóveis
          </Link>
        </div>
      ) : null}

      {!isLoading && !isError && favorites.length > 0 ? (
        <div className={styles.grid}>
          {favorites.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
