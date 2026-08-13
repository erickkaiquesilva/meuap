import { useState, useEffect, useCallback } from 'react'
import type { Property } from '@/shared/types/property'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { buildWhatsAppUrl } from '@/shared/utils/buildWhatsAppUrl'
import styles from './PropertyHero.module.css'

/* ── Icons ──────────────────────────────────────────────────── */
function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

/* ── Type / operation labels ─────────────────────────────────── */
const TYPE_LABEL: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
}

const OP_LABEL: Record<string, string> = {
  rent: 'Aluguel',
  sale: 'Venda',
}

/* ── Component ───────────────────────────────────────────────── */
interface PropertyHeroProps {
  property: Property
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const { photos, title, price, operation, badge, type, bedrooms, bathrooms, area, parkingSpots, address, neighborhood, city } = property
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  const total = photos.length

  const prevStrip = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const nextStrip = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total])

  const prevLb = useCallback(() => setLightboxIdx((i) => (i - 1 + total) % total), [total])
  const nextLb = useCallback(() => setLightboxIdx((i) => (i + 1) % total), [total])

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prevLb()
      if (e.key === 'ArrowRight') nextLb()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prevLb, nextLb])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  function openLightbox(idx: number) {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }

  const whatsappUrl = buildWhatsAppUrl(
    `Olá! Tenho interesse no imóvel *${title}* (Ref. ${property.id}) — ${address}, ${neighborhood}. Poderia me passar mais informações?`,
  )

  /* Show up to 4 photos in the strip, scrollable via arrows */
  const visible = photos.slice(current, current + 4)

  return (
    <>
      {/* ── Full-bleed hero ──────────────────────────────────── */}
      <section className={styles.hero} aria-label="Visão geral do imóvel">

        {/* ── Left: info card ── */}
        <div className={styles.infoCard}>
          {/* Badges */}
          <div className={styles.badgeRow}>
            <span className="badge badge-outline">{TYPE_LABEL[type] ?? type}</span>
            <span className="badge badge-primary">{OP_LABEL[operation] ?? operation}</span>
            {badge && <span className="badge badge-secondary">{badge}</span>}
          </div>

          {/* Title — semantic h1 for this page */}
          <h1 className={styles.title}>{title}</h1>

          {/* Address */}
          <p className={styles.address}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {address} — {neighborhood}, {city}
          </p>

          {/* Quick specs */}
          <div className={styles.specs}>
            <span className={styles.spec}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 22v-7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7" />
                <path d="M3 15H1v-4a2 2 0 0 1 2-2h2" />
                <path d="M21 15h2v-4a2 2 0 0 0-2-2h-2" />
                <path d="M8 11V7a4 4 0 1 1 8 0v4" />
              </svg>
              {bedrooms} {bedrooms === 1 ? 'quarto' : 'quartos'}
            </span>
            <span className={styles.spec}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                <line x1="10" y1="5" x2="8" y2="7" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
              {bathrooms} {bathrooms === 1 ? 'banheiro' : 'banheiros'}
            </span>
            <span className={styles.spec}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              {parkingSpots} {parkingSpots === 1 ? 'vaga' : 'vagas'}
            </span>
            <span className={styles.spec}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
              {area} m²
            </span>
          </div>

          {/* Price */}
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>{OP_LABEL[operation] ?? operation}</span>
            <span className={styles.price}>{formatCurrency(price)}</span>
            {operation === 'rent' && <span className={styles.priceSuffix}>/mês</span>}
          </div>

          {/* CTAs */}
          <div className={styles.ctas}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-primary ${styles.ctaBtn}`}
            >
              <WhatsAppIcon />
              Falar no WhatsApp
            </a>
            <button type="button" className={`btn btn-outline ${styles.ctaBtn}`}>
              Agendar visita
            </button>
          </div>
        </div>

        {/* ── Right: connected photo strip ── */}
        <div
          className={styles.photosArea}
          role="region"
          aria-label={`Galeria — ${total} foto${total !== 1 ? 's' : ''}`}
        >
          {/* Action overlays: share + heart (top-left) */}
          <div className={styles.actionIcons}>
            <button type="button" className={styles.glassBtn} aria-label="Compartilhar imóvel">
              <ShareIcon />
            </button>
            <button type="button" className={styles.glassBtn} aria-label="Salvar nos favoritos">
              <HeartIcon />
            </button>
          </div>

          {/* Photo cells */}
          {visible.map((src, idx) => (
            <button
              key={`${src}-${current + idx}`}
              type="button"
              className={`${styles.photoCell} ${idx === 0 ? styles.photoCellMain : styles.photoCellSide}`}
              onClick={() => openLightbox(current + idx)}
              aria-label={`Ver foto ${current + idx + 1} em tela cheia`}
            >
              <img
                src={src}
                alt={idx === 0 ? title : ''}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </button>
          ))}

          {/* Pills: Fotos | Vídeo | Mapa (bottom-left) */}
          <div className={styles.pills}>
            <button type="button" className={styles.pill} onClick={() => openLightbox(0)} aria-label={`Ver todas as ${total} fotos`}>
              <CameraIcon /> {total} Fotos
            </button>
            <button type="button" className={styles.pill} disabled aria-label="Vídeo indisponível">
              <VideoIcon /> Vídeo
            </button>
            <button type="button" className={styles.pill} disabled aria-label="Mapa indisponível">
              <MapIcon /> Mapa
            </button>
          </div>

          {/* Navigation arrows (bottom-right) */}
          {total > 1 && (
            <div className={styles.navArrows}>
              <button
                type="button"
                className={styles.glassBtn}
                onClick={prevStrip}
                disabled={current === 0}
                aria-label="Fotos anteriores"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                className={styles.glassBtn}
                onClick={nextStrip}
                disabled={current + 4 >= total}
                aria-label="Próximas fotos"
              >
                <ChevronIcon dir="right" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria em tela cheia"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false) }}
        >
          <div className={styles.lightboxInner}>
            {total > 1 && (
              <button type="button" className={`${styles.lbArrow} ${styles.lbPrev}`} onClick={prevLb} aria-label="Foto anterior">
                <ChevronIcon dir="left" />
              </button>
            )}
            <img
              className={styles.lightboxImg}
              src={photos[lightboxIdx]}
              alt={`${title} — foto ${lightboxIdx + 1} de ${total}`}
            />
            {total > 1 && (
              <button type="button" className={`${styles.lbArrow} ${styles.lbNext}`} onClick={nextLb} aria-label="Próxima foto">
                <ChevronIcon dir="right" />
              </button>
            )}
          </div>
          <button type="button" className={styles.lbClose} onClick={() => setLightboxOpen(false)} aria-label="Fechar galeria">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <span className={styles.lbCounter} aria-live="polite">{lightboxIdx + 1} / {total}</span>
        </div>
      )}
    </>
  )
}
