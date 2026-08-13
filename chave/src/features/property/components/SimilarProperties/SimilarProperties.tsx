import { Link } from 'react-router-dom'
import type { Property } from '@/shared/types/property'
import { PropertyCard } from '@/shared/components/PropertyCard/PropertyCard'
import styles from './SimilarProperties.module.css'

interface SimilarPropertiesProps {
  properties: Property[]
  currentCity: string
}

export function SimilarProperties({ properties, currentCity }: SimilarPropertiesProps) {
  if (properties.length === 0) return null

  const listingsHref = `/imoveis?city=${encodeURIComponent(currentCity)}`

  return (
    <section className={styles.section} aria-label="Imóveis similares">
      <div className={styles.header}>
        <h2 className={styles.title}>Imóveis similares</h2>
        <Link to={listingsHref} className={styles.viewAll}>
          Ver todos em {currentCity}
        </Link>
      </div>
      <div className={styles.grid}>
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  )
}
