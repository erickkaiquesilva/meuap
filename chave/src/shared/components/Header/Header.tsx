import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Chave Imóveis — Página inicial">
          chave<span className={styles.dot}>.</span>
        </Link>

        <nav aria-label="Menu principal" className={styles.nav}>
          <NavLink to="/imoveis?op=rent" className={styles.navLink}>
            Alugar
          </NavLink>
          <NavLink to="/imoveis?op=sale" className={styles.navLink}>
            Comprar
          </NavLink>
          <Link to="/entrar" className="btn btn-primary btn-sm">
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}
