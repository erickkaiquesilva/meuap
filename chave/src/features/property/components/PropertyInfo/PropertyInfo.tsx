import type { Property } from '@/shared/types/property'
import { Badge } from '@/shared/components/Badge/Badge'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import styles from './PropertyInfo.module.css'

const TYPE_LABEL: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
}

const OP_LABEL: Record<string, string> = {
  rent: 'Aluguel',
  sale: 'Venda',
}

interface PropertyInfoProps {
  property: Property
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className={styles.info}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className="badge badge-outline">{TYPE_LABEL[property.type] ?? property.type}</span>
          <span className="badge badge-primary">{OP_LABEL[property.operation] ?? property.operation}</span>
          {property.badge && <Badge variant="secondary">{property.badge}</Badge>}
        </div>

        <h1 className={styles.title}>{property.title}</h1>

        <p className={styles.address}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.address} — {property.neighborhood}, {property.city}
        </p>

        <div>
          <span className={styles.price}>{formatCurrency(property.price)}</span>
          {property.operation === 'rent' && (
            <span className={styles.priceSuffix}>/mês</span>
          )}
        </div>
      </div>

      {/* Specs */}
      <div className={styles.specsGrid}>
        <div className={styles.specItem}>
          <span className={styles.specIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 22v-7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7" />
              <path d="M3 15H1v-4a2 2 0 0 1 2-2h2" />
              <path d="M21 15h2v-4a2 2 0 0 0-2-2h-2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" />
            </svg>
          </span>
          <span className={styles.specValue}>{property.bedrooms}</span>
          <span className={styles.specLabel}>{property.bedrooms === 1 ? 'Quarto' : 'Quartos'}</span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
              <line x1="10" y1="5" x2="8" y2="7" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </span>
          <span className={styles.specValue}>{property.bathrooms}</span>
          <span className={styles.specLabel}>{property.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}</span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </span>
          <span className={styles.specValue}>{property.parkingSpots}</span>
          <span className={styles.specLabel}>{property.parkingSpots === 1 ? 'Vaga' : 'Vagas'}</span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
          </span>
          <span className={styles.specValue}>{property.area}</span>
          <span className={styles.specLabel}>m²</span>
        </div>
      </div>

      {/* Description */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Descrição</h2>
        <p className={styles.description}>{property.description}</p>
      </div>

      {/* Amenities */}
      {property.amenities.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Comodidades</h2>
          <ul className={styles.amenities} aria-label="Lista de comodidades">
            {property.amenities.map((amenity) => (
              <li key={amenity} className={styles.amenityItem}>
                <span className={styles.amenityCheck} aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Location placeholder */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Localização</h2>
        <div className={styles.mapPlaceholder} aria-label="Mapa indisponível">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p>{property.address} — {property.neighborhood}, {property.city}</p>
        </div>
      </div>
    </div>
  )
}
