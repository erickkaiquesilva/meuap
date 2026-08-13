import { useState, useEffect, useCallback } from 'react'
import type { Property } from '@/shared/types/property'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { buildWhatsAppUrl } from '@/shared/utils/buildWhatsAppUrl'
import styles from './PropertyHero.module.css'

const TYPE_LABEL: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
}

const BADGE_VARIANT: Record<NonNullable<Property['badge']>, string> = {
  'Novo': 'badge-success',
  'Exclusivo': 'badge-primary',
  'Abaixo do mercado': 'badge-warning',
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left'
        ? <path d="M15 18l-6-6 6-6" />
        : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

interface PropertyHeroProps {
  property: Property
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const { photos, title, price, operation, badge, type } = property
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const total = photos.length

  const prevPhoto = useCallback(() => setLightboxIdx((i) => (i - 1 + total) % total), [total])
  const nextPhoto = useCallback(() => setLightboxIdx((i) => (i + 1) % total), [total])

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prevPhoto, nextPhoto])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  function openLightbox(idx: number) {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }

  const whatsappUrl = buildWhatsAppUrl(
    `Olá! Tenho interesse no imóvel *${title}* (Ref. ${property.id}) — ${property.address}, ${property.neighborhood}. Poderia me passar mais informações?`,
  )

  // Show max 3 photos in the strip; the rest are accessible via lightbox
  const stripPhotos = photos.slice(0, 3)

  return (
    <section className={styles.hero} aria-label="Visão geral do imóvel">
      {/* ── Left: info + CTAs ── */}
      <div className={styles.infoCol}>
        <div className={styles.badgeRow}>
          {badge && (
            <span className={`badge ${BADGE_VARIANT[badge]}`}>{badge}</span>
          )}
          <span className="badge badge-outline">
            {TYPE_LABEL[type] ?? type}
          </span>
          <span className="badge badge-outline">
            {operation === 'rent' ? 'Aluguel' : 'Venda'}
          </span>
        </div>

        <h1 className={styles.title}>{title}</h1>

        <p className={styles.address}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.address} — {property.neighborhood}, {property.city}
        </p>

        <div className={styles.priceBlock}>
          <p className={styles.priceLabel}>
            {operation === 'rent' ? 'Valor do aluguel' : 'Valor de venda'}
          </p>
          <p className={styles.price}>{formatCurrency(price)}</p>
        </div>

        <div className={styles.ctas}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-primary ${styles.ctaBtn}`}
            aria-label="Falar com corretor via WhatsApp"
          >
            <WhatsAppIcon />
            Converse conosco
          </a>
          <button
            type="button"
            className={`btn btn-outline ${styles.ctaBtn}`}
            onClick={() => openLightbox(0)}
          >
            Ver todas as fotos
          </button>
        </div>
      </div>

      {/* ── Right: connected photo strip ── */}
      <div
        className={styles.strip}
        role="region"
        aria-label={`Galeria — ${total} foto${total !== 1 ? 's' : ''}`}
      >
        {stripPhotos.map((src, idx) => (
          <button
            key={src}
            type="button"
            className={`${styles.photoCell} ${idx === 0 ? styles.photoCellMain : styles.photoCellSide}`}
            onClick={() => openLightbox(idx)}
            aria-label={`Ver foto ${idx + 1} em tela cheia`}
          >
            <img
              src={src}
              alt={idx === 0 ? title : ''}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </button>
        ))}

        {/* Photo count pill — bottom-left of the strip */}
        <button
          type="button"
          className={styles.photoPill}
          onClick={() => openLightbox(0)}
          aria-label={`Ver todas as ${total} fotos`}
        >
          <CameraIcon />
          {total} {total === 1 ? 'Foto' : 'Fotos'}
        </button>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos em tela cheia"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false) }}
        >
          <div className={styles.lightboxInner}>
            {total > 1 && (
              <button
                type="button"
                className={`${styles.lbArrow} ${styles.lbPrev}`}
                onClick={prevPhoto}
                aria-label="Foto anterior"
              >
                <ChevronIcon dir="left" />
              </button>
            )}

            <img
              className={styles.lightboxImg}
              src={photos[lightboxIdx]}
              alt={`${title} — foto ${lightboxIdx + 1} de ${total}`}
            />

            {total > 1 && (
              <button
                type="button"
                className={`${styles.lbArrow} ${styles.lbNext}`}
                onClick={nextPhoto}
                aria-label="Próxima foto"
              >
                <ChevronIcon dir="right" />
              </button>
            )}
          </div>

          <button
            type="button"
            className={styles.lbClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar galeria"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <span className={styles.lbCounter} aria-live="polite">
            {lightboxIdx + 1} / {total}
          </span>
        </div>
      )}
    </section>
  )
}
