import { Link } from 'react-router-dom'
import { neighborhoodCards } from '../../data/neighborhoodsHome'
import styles from './Neighborhoods.module.css'

export function Neighborhoods() {
  return (
    <section className={styles.section} aria-labelledby="neighborhoods-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="neighborhoods-title" className={styles.title}>Explore por bairro</h2>
          <Link to="/imoveis" className={styles.link}>
            Ver todos →
          </Link>
        </div>

        <div className={styles.grid}>
          {neighborhoodCards.map((n) => (
            <Link
              key={n.id}
              to={`/imoveis?city=${encodeURIComponent(n.city)}&neighborhood=${encodeURIComponent(n.name)}`}
              className={styles.card}
              aria-label={`Ver imóveis em ${n.name}, ${n.city}`}
            >
              <div
                className={styles.cardBg}
                style={{ background: n.gradient }}
                aria-hidden="true"
              />
              <div className={styles.cardLabel}>
                <span className={styles.neighborhood}>{n.name}</span>
                <span className={styles.city}>{n.city}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
