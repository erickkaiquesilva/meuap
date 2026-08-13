import { useState, useEffect, useCallback } from 'react'
import styles from './PhotoGallery.module.css'

interface PhotoGalleryProps {
  photos: string[]
  title: string
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const total = photos.length

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prev, next])

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (total === 0) return null

  return (
    <>
      <div className={styles.gallery}>
        {/* Main photo */}
        <div className={styles.mainPhoto}>
          <img
            src={photos[current]}
            alt={`${title} — foto ${current + 1} de ${total}`}
            loading={current === 0 ? 'eager' : 'lazy'}
          />

          {total > 1 && (
            <>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev}`}
                onClick={prev}
                aria-label="Foto anterior"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={next}
                aria-label="Próxima foto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <span className={styles.counter} aria-live="polite">
            {current + 1} / {total}
          </span>

          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setLightboxOpen(true)}
            aria-label="Ver todas as fotos em tela cheia"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            Ver todas
          </button>
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className={styles.thumbs} role="listbox" aria-label="Miniaturas das fotos">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                role="option"
                aria-selected={i === current}
                className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Foto ${i + 1}`}
              >
                <img src={src} alt="" aria-hidden="true" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false) }}
        >
          <div className={styles.lightboxInner}>
            {total > 1 && (
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev}`}
                onClick={prev}
                aria-label="Foto anterior"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            <img
              className={styles.lightboxImg}
              src={photos[current]}
              alt={`${title} — foto ${current + 1} de ${total}`}
            />

            {total > 1 && (
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={next}
                aria-label="Próxima foto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar galeria"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <span className={styles.lightboxCounter}>{current + 1} / {total}</span>
        </div>
      )}
    </>
  )
}
