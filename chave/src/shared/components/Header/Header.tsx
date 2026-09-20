import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import styles from './Header.module.css'

const CITIES = ['Maringá', 'Sarandi']

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  const first = parts[0]![0] ?? ''
  const last = parts[parts.length - 1]![0] ?? ''
  return `${first}${last}`.toUpperCase()
}

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
    if (isAuthenticated && user?.goal === 'list' && user.onboardingComplete) {
      navigate('/anuncios')
      return
    }
    if (!isAuthenticated) {
      navigate('/cadastro')
      return
    }
    if (user?.goal === 'list' && !user.onboardingComplete) {
      navigate('/onboarding/anunciar')
      return
    }
    navigate('/cadastro')
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (accountOpen) {
          setAccountOpen(false)
          return
        }
        if (menuOpen) {
          setMenuOpen(false)
          triggerRef.current?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, accountOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!accountOpen) return
    function onPointerDown(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [accountOpen])

  function closeMenu() {
    setMenuOpen(false)
    triggerRef.current?.focus()
  }

  const displayName = user?.name?.trim() || 'Conta'

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
              <NavLink
                to="/favoritos"
                className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}
              >
                Favoritos
              </NavLink>
              <NavLink
                to="/alertas"
                className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}
              >
                Alertas
              </NavLink>
              {user?.goal === 'list' && user.onboardingComplete ? (
                <NavLink
                  to="/anuncios"
                  className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}
                >
                  Meus anúncios
                </NavLink>
              ) : null}
              <div
                className={styles.account}
                ref={accountRef}
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  className={styles.avatarBtn}
                  aria-label="Menu da conta"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <span className={styles.avatar} aria-hidden="true">
                    {userInitials(displayName)}
                  </span>
                </button>
                {accountOpen ? (
                  <div className={styles.accountMenu} role="menu">
                    <p className={styles.accountName}>{displayName}</p>
                    <Link
                      to="/recuperar-senha"
                      role="menuitem"
                      className={styles.accountItem}
                      onClick={() => setAccountOpen(false)}
                    >
                      Trocar senha
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.accountItem}
                      onClick={() => {
                        setAccountOpen(false)
                        void handleLogout()
                      }}
                    >
                      Sair
                    </button>
                  </div>
                ) : null}
              </div>
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
        hidden={!menuOpen}
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
            <>
              <NavLink to="/favoritos" className={styles.drawerLink} onClick={closeMenu}>
                Favoritos
              </NavLink>
              <NavLink to="/alertas" className={styles.drawerLink} onClick={closeMenu}>
                Alertas
              </NavLink>
              {user?.goal === 'list' && user.onboardingComplete ? (
                <NavLink to="/anuncios" className={styles.drawerLink} onClick={closeMenu}>
                  Meus anúncios
                </NavLink>
              ) : null}
              <p className={styles.drawerUser}>{displayName}</p>
              <NavLink to="/recuperar-senha" className={styles.drawerLink} onClick={closeMenu}>
                Trocar senha
              </NavLink>
              <button
                type="button"
                className={styles.drawerLink}
                onClick={() => { void handleLogout(); closeMenu() }}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                Sair
              </button>
            </>
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
