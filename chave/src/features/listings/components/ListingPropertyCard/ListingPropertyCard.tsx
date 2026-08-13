import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import type { Property } from '@/shared/types/property'
import styles from './ListingPropertyCard.module.css'

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

function estimateTotal(property: Property): number | undefined {
  if (property.operation !== 'rent') return undefined
  const iptu = property.iptu ?? Math.round(property.price * 0.12)
  const fire = property.fireInsurance ?? Math.round(property.price * 0.03)
  const fee = property.serviceFee ?? Math.round(property.price * 0.08)
  return property.price + iptu + fire + fee
}

interface ListingPropertyCardProps {
  property: Property
}

export function ListingPropertyCard({ property }: ListingPropertyCardProps) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [favorited, setFavorited] = useState(false)
  const photos = property.photos.length > 0 ? property.photos : []
  const total = photos.length
  const totalCost = estimateTotal(property)

  function prevPhoto(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIdx((i) => (i - 1 + total) % total)
  }

  function nextPhoto(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIdx((i) => (i + 1) % total)
  }

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setFavorited((f) => !f)
  }

  return (
    <article className={styles.card}>
      {/* Photo carousel */}
      <div className={styles.media}>
        <Link
          to={`/imoveis/${property.id}`}
          className={styles.mediaLink}
          aria-label={`Ver detalhes: ${property.title}`}
        >
          {photos.length > 0 ? (
            <img
              src={photos[photoIdx]}
              alt={`${TYPE_LABEL[property.type]} em ${property.neighborhood} — foto ${photoIdx + 1} de ${total}`}
              className={styles.photo}
              loading="lazy"
            />
          ) : (
            <div className={styles.photoPlaceholder} aria-hidden="true" />
          )}
        </Link>

        {property.badge && (
          <span className={`badge ${BADGE_CLASS[property.badge]} ${styles.badge}`}>
            {property.badge}
          </span>
        )}

        <button
          type="button"
          className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`}
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={toggleFavorite}
        >
          <svg viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navPrev}`}
              onClick={prevPhoto}
              aria-label="Foto anterior"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navNext}`}
              onClick={nextPhoto}
              aria-label="Próxima foto"
            >
              <Chevron dir="right" />
            </button>
            <div className={styles.dots} aria-hidden="true">
              {photos.slice(0, 5).map((_, i) => (
                <span key={i} className={`${styles.dot} ${i === photoIdx ? styles.dotActive : ''}`} />
              ))}
              {total > 5 && <span className={styles.dotMore}>+{total - 5}</span>}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className={styles.body}>
        <Link to={`/imoveis/${property.id}`} className={styles.bodyLink}>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {formatCurrency(property.price)}
              {property.operation === 'rent' && <span className={styles.priceSuffix}>/mês</span>}
            </span>
            {totalCost !== undefined && (
              <span className={styles.totalPrice}>
                Total {formatCurrency(totalCost)}/mês
              </span>
            )}
          </div>

          <p className={styles.typeLine}>
            {TYPE_LABEL[property.type]} · {property.area} m²
          </p>

          <div className={styles.specs} aria-label="Especificações">
            {property.bedrooms > 0 && (
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
            )}
            {property.bathrooms > 0 && (
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
            )}
            {property.parkingSpots > 0 && (
              <span>{property.parkingSpots} {property.parkingSpots === 1 ? 'vaga' : 'vagas'}</span>
            )}
          </div>

          <p className={styles.address}>
            {property.address} — {property.neighborhood}, {property.city}
          </p>
        </Link>
      </div>
    </article>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}
