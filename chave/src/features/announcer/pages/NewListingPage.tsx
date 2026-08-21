import { Link } from 'react-router-dom'
import styles from './NewListingPage.module.css'

/** Stub until T058 — create listing form. */
export function NewListingPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Novo anúncio</h1>
      <p className={styles.sub}>
        O formulário completo de cadastro do imóvel entra no próximo ticket.
        Por enquanto você já pode voltar ao dashboard.
      </p>
      <Link to="/anuncios" className="btn btn-primary">
        Voltar para meus anúncios
      </Link>
    </div>
  )
}
