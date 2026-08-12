import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import styles from './Header.module.css'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Chave Imóveis — Página inicial">
          chave<span className={styles.dot}>.</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Menu principal" className={styles.desktopNav}>
          <NavLink to="/imoveis?op=rent" className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}>
            Alugar
          </NavLink>
          <NavLink to="/imoveis?op=sale" className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}>
            Comprar
          </NavLink>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user?.name}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <Link to="/entrar" className="btn btn-primary btn-sm">
              Entrar
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={triggerRef}
          className={styles.hamburger}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className={styles.overlay}
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Menu mobile">
          <NavLink to="/imoveis?op=rent" className={styles.drawerLink} onClick={closeMenu}>
            Alugar
          </NavLink>
          <NavLink to="/imoveis?op=sale" className={styles.drawerLink} onClick={closeMenu}>
            Comprar
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              className={styles.drawerLink}
              onClick={() => { handleLogout(); closeMenu() }}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              Sair ({user?.name})
            </button>
          ) : (
            <NavLink to="/entrar" className={styles.drawerLink} onClick={closeMenu}>
              Entrar
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
