import type { Property } from '@/shared/types/property'
import styles from './MapPanel.module.css'

interface MapPanelProps {
  properties: Property[]
  city?: string
  neighborhood?: string
  typeLabel?: string
  onClearType?: () => void
}

/** Deterministic pseudo-position from property id (mock map, no external API). */
function positionFromId(id: string): { x: number; y: number } {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  const x = 12 + (hash % 76)
  const y = 14 + ((hash >> 8) % 68)
  return { x, y }
}

function clusterBuckets(properties: Property[]) {
  const buckets = new Map<string, { count: number; x: number; y: number }>()
  for (const p of properties) {
    const { x, y } = positionFromId(p.id)
    const key = `${Math.floor(x / 12)}-${Math.floor(y / 12)}`
    const existing = buckets.get(key)
    if (existing) {
      existing.count += 1
      existing.x = (existing.x + x) / 2
      existing.y = (existing.y + y) / 2
    } else {
      buckets.set(key, { count: 1, x, y })
    }
  }
  return [...buckets.values()]
}

export function MapPanel({ properties, city, neighborhood, typeLabel, onClearType }: MapPanelProps) {
  const clusters = clusterBuckets(properties.slice(0, 24))
  const centerLabel = [neighborhood, city].filter(Boolean).join(', ') || 'Região'

  function handleDraw() {
    window.alert('Desenhar área de busca estará disponível em breve.')
  }

  return (
    <div className={styles.panel} role="region" aria-label="Mapa de imóveis">
      <div className={styles.mapSurface} aria-hidden="true">
        {/* Fake map grid / roads */}
        <svg className={styles.roads} viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect width="100" height="100" fill="#e8eef5" />
          <path d="M0 20 H100 M0 40 H100 M0 60 H100 M0 80 H100" stroke="#d5dde8" strokeWidth="0.4" />
          <path d="M20 0 V100 M40 0 V100 M60 0 V100 M80 0 V100" stroke="#d5dde8" strokeWidth="0.4" />
          <path d="M0 35 H100" stroke="#c5d0df" strokeWidth="1.2" />
          <path d="M55 0 V100" stroke="#c5d0df" strokeWidth="1.2" />
          <circle cx="48" cy="42" r="8" fill="#d4e8d4" opacity="0.7" />
        </svg>

        {/* Center pin */}
        <div className={styles.centerPin} style={{ left: '48%', top: '42%' }} title={centerLabel}>
          <span className={styles.pinDot} />
        </div>

        {/* Cluster bubbles */}
        {clusters.map((c, i) => (
          <div
            key={i}
            className={styles.cluster}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            {c.count}
          </div>
        ))}
      </div>

      {typeLabel && (
        <button
          type="button"
          className={styles.typeChip}
          onClick={onClearType}
          aria-label={`Remover filtro ${typeLabel}`}
        >
          {typeLabel} <span aria-hidden="true">✕</span>
        </button>
      )}

      <button type="button" className={styles.drawBtn} onClick={handleDraw}>
        <span className={styles.drawIcon} aria-hidden="true" />
        Desenhar área de busca
      </button>

      <div className={styles.zoom} role="group" aria-label="Zoom do mapa">
        <button type="button" aria-label="Aumentar zoom" onClick={() => {}}>＋</button>
        <button type="button" aria-label="Diminuir zoom" onClick={() => {}}>－</button>
      </div>
    </div>
  )
}
