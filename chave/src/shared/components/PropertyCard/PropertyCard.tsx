import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import type { Property } from '@/shared/types/property'
import styles from './PropertyCard.module.css'

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, var(--primary-300), var(--primary-600))',
  'linear-gradient(135deg, var(--secondary-400), var(--primary-500))',
  'linear-gradient(135deg, var(--neutral-400), var(--primary-700))',
  'linear-gradient(135deg, var(--secondary-300), var(--primary-400))',
  'linear-gradient(135deg, var(--primary-400), var(--neutral-800))',
]

const BADGE_CLASS: Record<NonNullable<Property['badge']>, string> = {
  'Novo': 'badge-success',
  'Exclusivo': 'badge-primary',
  'Abaixo do mercado': 'badge-warning',
}

const TYPE_LABEL: Record<Property['type'], string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
}

interface PropertyCardProps {
  property: Property
  index?: number
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [imgError, setImgError] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]
  const hasPhoto = property.photos.length > 0 && !imgError

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    setFavorited((f) => !f)
  }

  return (
    <article className={styles.card}>
      <Link to={`/imoveis/${property.id}`} className={styles.cardLink} aria-label={`Ver detalhes: ${property.title}`}>
        {/* Photo */}
        <div className={styles.photoWrapper} style={hasPhoto ? undefined : { background: gradient }}>
          {hasPhoto ? (
            <img
              src={property.photos[0]}
              alt={`Foto do imóvel — ${TYPE_LABEL[property.type]} em ${property.neighborhood}`}
              className={styles.photo}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          )}

          {/* Badge */}
          {property.badge && (
            <span className={`badge ${BADGE_CLASS[property.badge]} ${styles.badge}`}>
              {property.badge}
            </span>
          )}

          {/* Favorite */}
          <button
            type="button"
            className={`${styles.favoriteBtn} ${favorited ? styles.favoritedBtn : ''}`}
            aria-label={`${favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${property.title}`}
            onClick={toggleFavorite}
          >
            <svg viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.price}>
            {formatCurrency(property.price)}
            {property.operation === 'rent' && <span className={styles.priceSuffix}>/mês</span>}
          </div>
          <p className={styles.title}>
            {TYPE_LABEL[property.type]} · {property.neighborhood}, {property.city}
          </p>
          <div className={styles.specs} aria-label="Especificações do imóvel">
            {property.bedrooms > 0 && (
              <span>
                <BedIcon /> {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span>
                <ShowerIcon /> {property.bathrooms}
              </span>
            )}
            {property.parkingSpots > 0 && (
              <span>
                <CarIcon /> {property.parkingSpots}
              </span>
            )}
            <span>
              <AreaIcon /> {property.area} m²
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function BedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
    </svg>
  )
}

function ShowerIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h16V4.606a1.49 1.49 0 00-1.375-1.489A41.065 41.065 0 0013.5 3h-7zM2 12v2.5a1 1 0 001 1h14a1 1 0 001-1V12H2z" />
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" clipRule="evenodd" />
    </svg>
  )
}
