import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import styles from './Header.module.css'

const CITIES = ['Maringá', 'Sarandi']

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentCity = searchParams.get('city') ?? ''

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  function handleCityChange(city: string) {
    if (!city) {
      navigate('/imoveis')
      return
    }
    const params = new URLSearchParams(searchParams)
    params.set('city', city)
    params.delete('neighborhood')
    params.set('page', '1')
    navigate(`/imoveis?${params.toString()}`)
  }

  function handleAnnounceClick() {
    window.alert('Em breve você poderá anunciar seu imóvel na Chave.')
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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

        <nav aria-label="Menu principal" className={styles.desktopNav}>
          <NavLink to="/imoveis?op=rent" className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}>
            Alugar
          </NavLink>
          <NavLink to="/imoveis?op=sale" className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}>
            Comprar
          </NavLink>
          <button type="button" className={styles.navButton} onClick={handleAnnounceClick}>
            Anunciar
          </button>

          <label className={styles.citySelectWrap}>
            <span className={styles.srOnly}>Cidade</span>
            <select
              className={styles.citySelect}
              value={currentCity}
              onChange={(e) => handleCityChange(e.target.value)}
              aria-label="Selecionar cidade"
            >
              <option value="">Todas as cidades</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user?.name}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/cadastro" className="btn btn-outline btn-sm">
                Cadastre-se
              </Link>
              <Link to="/entrar" className="btn btn-primary btn-sm">
                Entrar
              </Link>
            </div>
          )}
        </nav>

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

      {menuOpen && (
        <div
          className={styles.overlay}
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}

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
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => { handleAnnounceClick(); closeMenu() }}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            Anunciar
          </button>
          <label className={styles.drawerCity}>
            <span>Cidade</span>
            <select
              className={styles.citySelect}
              value={currentCity}
              onChange={(e) => { handleCityChange(e.target.value); closeMenu() }}
              aria-label="Selecionar cidade"
            >
              <option value="">Todas as cidades</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
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
            <>
              <NavLink to="/entrar" className={styles.drawerLink} onClick={closeMenu}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className={styles.drawerLink} onClick={closeMenu}>
                Cadastre-se
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
