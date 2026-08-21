import { Outlet } from 'react-router-dom'
import { Header } from '@/shared/components/Header/Header'
import { Footer } from '@/shared/components/Footer/Footer'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
