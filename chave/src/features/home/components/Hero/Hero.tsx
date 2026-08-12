import { SearchBar } from '@/shared/components/SearchBar/SearchBar'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Busca de imóveis">
      <div className={styles.content}>
        <h1 className={styles.headline}>
          Encontre o imóvel <em className={styles.highlight}>certo</em>{' '}
          em Maringá e Sarandi
        </h1>
        <p className={styles.sub}>
          Aluguel e venda com a melhor experiência da região.
        </p>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar />
      </div>
    </section>
  )
}
