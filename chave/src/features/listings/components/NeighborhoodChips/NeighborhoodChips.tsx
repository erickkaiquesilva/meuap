import { Link, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()

  if (items.length === 0) return null

  const title = currentNeighborhood
    ? `Bairros próximos a ${currentNeighborhood}`
    : 'Bairros próximos'

  function hrefFor(n: NearbyNeighborhood) {
    const params = new URLSearchParams()
    const op = searchParams.get('op')
    if (op === 'rent' || op === 'sale') params.set('op', op)
    params.set('city', n.city)
    params.set('neighborhood', n.name)
    return `/imoveis?${params.toString()}`
  }

  return (
    <section className={styles.section} aria-label={title}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.row}>
        {items.map((n) => (
          <Link
            key={`${n.city}-${n.name}`}
            to={hrefFor(n)}
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
