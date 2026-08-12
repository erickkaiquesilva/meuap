import { Outlet } from 'react-router-dom'
import { Header } from '@/shared/components/Header/Header'
import { Footer } from '@/shared/components/Footer/Footer'

export function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
