import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.logo}>
              chave<span className={styles.dot}>.</span>
            </div>
            <p className={styles.desc}>
              A plataforma imobiliária de Maringá e Sarandi. Conectando pessoas aos seus lares.
            </p>
          </div>

          <nav aria-label="Links do rodapé — Alugar">
            <h4 className={styles.colTitle}>Alugar</h4>
            <ul className={styles.linkList}>
              <li><Link to="/imoveis?op=rent&type=apartment">Apartamentos</Link></li>
              <li><Link to="/imoveis?op=rent&type=house">Casas</Link></li>
              <li><Link to="/imoveis?op=rent&type=commercial">Comercial</Link></li>
            </ul>
          </nav>

          <nav aria-label="Links do rodapé — Comprar">
            <h4 className={styles.colTitle}>Comprar</h4>
            <ul className={styles.linkList}>
              <li><Link to="/imoveis?op=sale&type=apartment">Apartamentos</Link></li>
              <li><Link to="/imoveis?op=sale&type=house">Casas</Link></li>
              <li><Link to="/imoveis?op=sale&type=commercial">Comercial</Link></li>
            </ul>
          </nav>

          <nav aria-label="Links do rodapé — Empresa">
            <h4 className={styles.colTitle}>Empresa</h4>
            <ul className={styles.linkList}>
              <li><Link to="/">Sobre</Link></li>
              <li><Link to="/">Contato</Link></li>
              <li><Link to="/">Anunciar</Link></li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          © {new Date().getFullYear()} Chave. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
