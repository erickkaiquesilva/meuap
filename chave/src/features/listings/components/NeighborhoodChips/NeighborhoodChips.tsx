import { Link } from 'react-router-dom'
import styles from './NeighborhoodChips.module.css'

export interface NearbyNeighborhood {
  name: string
  city: string
  count: number
}

interface NeighborhoodChipsProps {
  currentNeighborhood?: string
  items: NearbyNeighborhood[]
}

export function NeighborhoodChips({ currentNeighborhood, items }: NeighborhoodChipsProps) {
  if (items.length === 0) return null

  const title = currentNeighborhood
    ? `Bairros próximos a ${currentNeighborhood}`
    : 'Bairros próximos'

  return (
    <section className={styles.section} aria-label={title}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.row}>
        {items.map((n) => (
          <Link
            key={`${n.city}-${n.name}`}
            to={`/imoveis?op=rent&city=${encodeURIComponent(n.city)}&neighborhood=${encodeURIComponent(n.name)}`}
            className={styles.chip}
          >
            <span className={styles.name}>{n.name}</span>
            <span className={styles.count}>{n.count}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
