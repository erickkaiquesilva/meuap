import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './AuthSplitLayout.module.css'

interface AuthSplitLayoutProps {
  title: string
  subtitle: string
  footer?: string
  children: ReactNode
}

export function AuthSplitLayout({
  title,
  subtitle,
  footer,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className={styles.shell}>
      <a href="#auth-form" className="skip-link">
        Ir para o formulário
      </a>

      <aside className={styles.brand} aria-label="Chave">
        <div className={styles.brandInner}>
          <Link to="/" className={styles.logo} aria-label="Chave Imóveis — Página inicial">
            chave<span>.</span>
          </Link>
          <h1 className={styles.headline}>{title}</h1>
          <p className={styles.lede}>{subtitle}</p>
        </div>
        {footer ? <p className={styles.brandFoot}>{footer}</p> : null}
      </aside>

      <main id="auth-form" className={styles.formSide} tabIndex={-1}>
        <div className={styles.formWrap}>{children}</div>
      </main>
    </div>
  )
}
