import { useState, useEffect, useCallback } from 'react'
import type { Property } from '@/shared/types/property'
import styles from './PropertyHero.module.css'

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}

interface PropertyHeroProps {
  property: Property
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const { photos, title } = property
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

  // Strip shows 4 photos; offset by `current` to scroll through
  const visible = photos.slice(current, current + 4)

  return (
    <>
      {/* ── Full-width photo strip ── */}
      <div
        className={styles.strip}
        role="region"
        aria-label={`Galeria — ${total} foto${total !== 1 ? 's' : ''}`}
      >
        {/* Overlay: share + heart (top-left) */}
        <div className={styles.actionIcons}>
          <button type="button" className={`btn btn-outline btn-sm ${styles.iconBtn}`} aria-label="Compartilhar imóvel">
            <ShareIcon />
          </button>
          <button type="button" className={`btn btn-outline btn-sm ${styles.iconBtn}`} aria-label="Salvar nos favoritos">
            <HeartIcon />
          </button>
        </div>

        {/* Photos */}
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

        {/* Overlay: pill buttons (bottom-left of first photo) */}
        <div className={styles.pills}>
          <button
            type="button"
            className={styles.pill}
            onClick={() => openLightbox(0)}
            aria-label={`Ver todas as ${total} fotos`}
          >
            <CameraIcon />
            {total} Fotos
          </button>
          <button type="button" className={styles.pill} aria-label="Ver vídeo" disabled>
            <VideoIcon />
            Vídeo
          </button>
          <button type="button" className={styles.pill} aria-label="Ver mapa" disabled>
            <MapPinIcon />
            Mapa
          </button>
        </div>

        {/* Navigation arrows (bottom-right) */}
        {total > 1 && (
          <div className={styles.navArrows}>
            <button
              type="button"
              className={`btn btn-outline btn-sm ${styles.navBtn}`}
              onClick={prevStrip}
              disabled={current === 0}
              aria-label="Fotos anteriores"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              type="button"
              className={`btn btn-outline btn-sm ${styles.navBtn}`}
              onClick={nextStrip}
              disabled={current + 4 >= total}
              aria-label="Próximas fotos"
            >
              <ChevronIcon dir="right" />
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
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
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <span className={styles.lbCounter} aria-live="polite">{lightboxIdx + 1} / {total}</span>
        </div>
      )}
    </>
  )
}
