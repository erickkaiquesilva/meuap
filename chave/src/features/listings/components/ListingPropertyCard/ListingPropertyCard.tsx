import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import type { Property } from '@/shared/types/property'
import styles from './ListingPropertyCard.module.css'

const TYPE_LABEL: Record<Property['type'], string> = {
  apartment: 'apartamento',
  house: 'casa',
  commercial: 'imóvel comercial',
}

function estimateTotal(property: Property): number | undefined {
  if (property.operation !== 'rent') return undefined
  const iptu = property.iptu ?? Math.round(property.price * 0.12)
  const fire = property.fireInsurance ?? Math.round(property.price * 0.03)
  const fee = property.serviceFee ?? Math.round(property.price * 0.08)
  return property.price + iptu + fire + fee
}

function buildBlurb(property: Property): string {
  const op = property.operation === 'rent' ? 'Alugar' : 'Comprar'
  const type = TYPE_LABEL[property.type]
  const rooms = property.bedrooms > 0
    ? ` com ${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}`
    : ''
  const amenity = property.amenities[0] ? ` e ${property.amenities[0].toLowerCase()}` : ''
  return `${op} ${type}${rooms}${amenity}.`
}

interface ListingPropertyCardProps {
  property: Property
}

export function ListingPropertyCard({ property }: ListingPropertyCardProps) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [favorited, setFavorited] = useState(false)
  const photos = property.photos
  const total = photos.length
  const totalCost = estimateTotal(property)

  function go(delta: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (total < 2) return
    setPhotoIdx((i) => (i + delta + total) % total)
  }

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setFavorited((f) => !f)
  }

  const specs = [
    `${property.area} m²`,
    property.bedrooms > 0
      ? `${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}`
      : null,
    property.parkingSpots > 0
      ? `${property.parkingSpots} ${property.parkingSpots === 1 ? 'vaga' : 'vagas'}`
      : null,
  ].filter(Boolean).join(' · ')

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link to={`/imoveis/${property.id}`} className={styles.mediaLink} aria-label={property.title}>
          {photos.length > 0 ? (
            <img
              src={photos[photoIdx]}
              alt=""
              className={styles.photo}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder} />
          )}
        </Link>

        <div className={styles.badges}>
          {property.badge && (
            <span className={`${styles.badge} ${property.badge === 'Exclusivo' ? styles.badgeDark : styles.badgeSoft}`}>
              {property.badge === 'Novo' ? 'Anúncio novo' : property.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`${styles.favorite} ${favorited ? styles.favorited : ''}`}
          aria-label={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          onClick={toggleFavorite}
        >
          <svg viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {total > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.navPrev}`} onClick={(e) => go(-1, e)} aria-label="Foto anterior">
              ‹
            </button>
            <button type="button" className={`${styles.nav} ${styles.navNext}`} onClick={(e) => go(1, e)} aria-label="Próxima foto">
              ›
            </button>
            <div className={styles.dots} aria-hidden="true">
              {photos.slice(0, 5).map((_, i) => (
                <span key={i} className={`${styles.dot} ${i === photoIdx ? styles.dotOn : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <Link to={`/imoveis/${property.id}`} className={styles.body}>
        <p className={styles.blurb}>{buildBlurb(property)}</p>
        <p className={styles.price}>
          {formatCurrency(property.price)}{' '}
          <span className={styles.priceKind}>
            {property.operation === 'rent' ? 'aluguel' : ''}
          </span>
        </p>
        {totalCost !== undefined && (
          <p className={styles.total}>{formatCurrency(totalCost)} total</p>
        )}
        <p className={styles.specs}>{specs}</p>
        <p className={styles.address}>
          {property.address}, {property.neighborhood}, {property.city}
        </p>
      </Link>
    </article>
  )
}
