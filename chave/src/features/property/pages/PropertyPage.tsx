import { Link, useParams } from 'react-router-dom'
import { useProperty, useSimilarProperties } from '../hooks/useProperty'
import { PropertyHero } from '../components/PropertyHero/PropertyHero'
import { PropertyInfo } from '../components/PropertyInfo/PropertyInfo'
import { ContactCard } from '../components/ContactCard/ContactCard'
import { SimilarProperties } from '../components/SimilarProperties/SimilarProperties'
import styles from './PropertyPage.module.css'

function SkeletonPage() {
  return (
    <div className={styles.page}>
      <div className={`${styles.skeletonBlock}`} style={{ height: '400px', marginBottom: '24px', borderRadius: '16px' }} aria-hidden="true" />
      <div className={styles.skeleton} aria-busy="true" aria-label="Carregando detalhes do imóvel">
        <div className={`${styles.skeletonBlock}`} style={{ height: '500px' }} />
        <div className={`${styles.skeletonBlock}`} style={{ height: '360px' }} />
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.centered} role="alert">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-300)" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <p style={{ font: '700 20px/1.2 var(--font-display)', color: 'var(--neutral-800)' }}>
          Imóvel não encontrado
        </p>
        <p style={{ font: '400 14px/1.5 var(--font-ui)', color: 'var(--neutral-500)' }}>
          Este imóvel pode ter sido removido ou o link está incorreto.
        </p>
        <Link to="/imoveis" className="btn btn-primary">Ver outros imóveis</Link>
      </div>
    </div>
  )
}

export function PropertyPage() {
  const { id } = useParams<{ id: string }>()
  const { data: property, isLoading, isError } = useProperty(id ?? '')
  const { data: similar = [] } = useSimilarProperties(id ?? '')

  if (isLoading) return <SkeletonPage />
  if (isError || !property) return <NotFound />

  const opLabel = property.operation === 'rent' ? 'Alugar' : 'Comprar'

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Caminho">
        <Link to="/">Início</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/imoveis?op=${property.operation}`}>{opLabel}</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/imoveis?city=${encodeURIComponent(property.city)}`}>{property.city}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{property.neighborhood}</span>
      </nav>

      {/* Hero: info + connected photo strip */}
      <PropertyHero property={property} />

      {/* Info + Contact side-by-side */}
      <div className={styles.layout}>
        <PropertyInfo property={property} />
        <ContactCard property={property} />
      </div>

      {/* Similar properties */}
      <SimilarProperties properties={similar} currentCity={property.city} />
    </div>
  )
}
