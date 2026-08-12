import { Link } from 'react-router-dom'
import { useFeaturedProperties } from '../../hooks/useFeaturedProperties'
import { PropertyCard } from '@/shared/components/PropertyCard/PropertyCard'
import styles from './FeaturedGrid.module.css'

function CardSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonPhoto} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonLineLg}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineSm}`} />
        <div className={styles.skeletonSpecs}>
          <div className={styles.skeletonSpec} />
          <div className={styles.skeletonSpec} />
          <div className={styles.skeletonSpec} />
        </div>
      </div>
    </div>
  )
}

export function FeaturedGrid() {
  const { data: properties, isLoading, isError, refetch } = useFeaturedProperties()

  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="featured-title" className={styles.title}>Imóveis em destaque</h2>
          <Link to="/imoveis" className={styles.link}>
            Ver todos →
          </Link>
        </div>

        {isLoading && (
          <div
            className={styles.grid}
            aria-live="polite"
            aria-busy="true"
            aria-label="Carregando imóveis em destaque"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className={styles.error} role="alert">
            <p>Não foi possível carregar os imóveis.</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => refetch()}>
              Tentar novamente
            </button>
          </div>
        )}

        {properties && properties.length > 0 && (
          <div
            className={styles.grid}
            aria-live="polite"
            aria-label={`${properties.length} imóveis em destaque`}
          >
            {properties.slice(0, 6).map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
