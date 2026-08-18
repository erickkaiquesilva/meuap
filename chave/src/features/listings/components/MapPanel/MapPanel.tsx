import { useCallback, useEffect, useRef, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api'
import { Link } from 'react-router-dom'
import type { Property } from '@/shared/types/property'
import { googleMapsApiKey, hasGoogleMaps } from '@/core/api/config'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatMapPrice, getCityCenter } from '@/shared/utils/propertyCoords'
import { useGeocodedMarkers, type MarkerPoint } from '../../hooks/useGeocodedMarkers'
import styles from './MapPanel.module.css'

interface MapPanelProps {
  properties: Property[]
  city?: string
  neighborhood?: string
  typeLabel?: string
  onClearType?: () => void
  onVisibleChange?: (ids: string[]) => void
}

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: 'greedy',
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  ],
}

function FakeMapSurface({ properties }: { properties: Property[] }) {
  function positionFromId(id: string) {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
    return { x: 12 + (hash % 76), y: 14 + ((hash >> 8) % 68) }
  }

  const clusters = (() => {
    const buckets = new Map<string, { count: number; x: number; y: number }>()
    for (const p of properties.slice(0, 24)) {
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
  })()

  return (
    <div className={styles.mapSurface} aria-hidden="true">
      <svg className={styles.roads} viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#e8eef5" />
        <path d="M0 20 H100 M0 40 H100 M0 60 H100 M0 80 H100" stroke="#d5dde8" strokeWidth="0.4" />
        <path d="M20 0 V100 M40 0 V100 M60 0 V100 M80 0 V100" stroke="#d5dde8" strokeWidth="0.4" />
        <path d="M0 35 H100" stroke="#c5d0df" strokeWidth="1.2" />
        <path d="M55 0 V100" stroke="#c5d0df" strokeWidth="1.2" />
        <circle cx="48" cy="42" r="8" fill="#d4e8d4" opacity="0.7" />
      </svg>
      <div className={styles.centerPin} style={{ left: '48%', top: '42%' }}>
        <span className={styles.pinDot} />
      </div>
      {clusters.map((c, i) => (
        <div key={i} className={styles.cluster} style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          {c.count}
        </div>
      ))}
      <p className={styles.mockHint}>
        Defina <code>VITE_GOOGLE_MAPS_API_KEY</code> no .env para o mapa do Google
      </p>
    </div>
  )
}

function MapOverlays({
  typeLabel,
  neighborhood,
  city,
  onClearType,
  onDraw,
  onZoomIn,
  onZoomOut,
  zoomEnabled,
}: {
  typeLabel?: string
  neighborhood?: string
  city?: string
  onClearType?: () => void
  onDraw: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  zoomEnabled: boolean
}) {
  return (
    <>
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

      {neighborhood && (
        <span className={styles.areaLabel}>
          {neighborhood}{city ? `, ${city}` : ''}
        </span>
      )}

      <button type="button" className={styles.drawBtn} onClick={onDraw}>
        <span className={styles.drawIcon} aria-hidden="true" />
        Desenhar área de busca
      </button>

      <div className={styles.zoom} role="group" aria-label="Zoom do mapa">
        <button type="button" aria-label="Aumentar zoom" onClick={onZoomIn} disabled={!zoomEnabled}>＋</button>
        <button type="button" aria-label="Diminuir zoom" onClick={onZoomOut} disabled={!zoomEnabled}>－</button>
      </div>
    </>
  )
}

function HoverBalloon({ property }: { property: Property }) {
  const photo = property.photos[0]
  const specs = [
    `${property.area} m²`,
    property.bedrooms > 0 ? `${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}` : null,
    property.parkingSpots > 0 ? `${property.parkingSpots} ${property.parkingSpots === 1 ? 'vaga' : 'vagas'}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <Link to={`/imoveis/${property.id}`} className={styles.balloon}>
      {photo ? (
        <img src={photo} alt="" className={styles.balloonPhoto} />
      ) : (
        <div className={styles.balloonPhotoFallback} />
      )}
      <div className={styles.balloonBody}>
        <p className={styles.balloonPrice}>
          {formatCurrency(property.price)}
          {property.operation === 'rent' ? ' aluguel' : ''}
        </p>
        <p className={styles.balloonTitle}>{property.title}</p>
        <p className={styles.balloonSpecs}>{specs}</p>
        <p className={styles.balloonAddr}>
          {property.address}, {property.neighborhood}
        </p>
      </div>
    </Link>
  )
}

function emitVisible(map: google.maps.Map, points: MarkerPoint[], onVisibleChange?: (ids: string[]) => void) {
  const bounds = map.getBounds()
  if (!bounds || !onVisibleChange) return
  const ids = points
    .filter(({ position }) => bounds.contains(new google.maps.LatLng(position.lat, position.lng)))
    .map(({ property }) => property.id)
  onVisibleChange(ids)
}

function GoogleMapPanel({
  properties,
  city,
  neighborhood,
  typeLabel,
  onClearType,
  onVisibleChange,
}: MapPanelProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hideTimer = useRef<number | null>(null)
  const fittedKey = useRef<string>('')
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'chave-google-maps',
    googleMapsApiKey,
  })

  const { points, ready } = useGeocodedMarkers(properties, isLoaded && !loadError)
  const center = getCityCenter(city)
  const hovered = points.find((p) => p.property.id === hoveredId)

  const reportVisible = useCallback((m: google.maps.Map | null) => {
    if (!m) return
    emitVisible(m, points, onVisibleChange)
  }, [points, onVisibleChange])

  const onLoad = useCallback((m: google.maps.Map) => {
    setMap(m)
    m.setCenter(center)
    m.setZoom(13)
  }, [center])

  const onUnmount = useCallback(() => setMap(null), [])

  // Fit once after addresses are geocoded for this listing set
  useEffect(() => {
    if (!map || !ready || points.length === 0) return
    const key = points.map((p) => p.property.id).join(',')
    if (fittedKey.current === key) {
      reportVisible(map)
      return
    }
    fittedKey.current = key
    const bounds = new google.maps.LatLngBounds()
    points.forEach(({ position }) => bounds.extend(position))
    map.fitBounds(bounds, 48)
    window.setTimeout(() => reportVisible(map), 350)
  }, [map, points, ready, reportVisible])

  function handleDraw() {
    window.alert('Desenhar área de busca estará disponível em breve.')
  }

  function showBalloon(id: string) {
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    setHoveredId(id)
  }

  function scheduleHideBalloon() {
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setHoveredId(null), 280)
  }

  if (loadError) {
    return (
      <div className={styles.panel} role="region" aria-label="Mapa de imóveis">
        <FakeMapSurface properties={properties} />
        <p className={styles.errorBanner} role="alert">
          Não foi possível carregar o Google Maps. Verifique a API key e as restrições de HTTP referrer.
        </p>
        <MapOverlays
          typeLabel={typeLabel}
          neighborhood={neighborhood}
          city={city}
          onClearType={onClearType}
          onDraw={handleDraw}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          zoomEnabled={false}
        />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={styles.panel} role="region" aria-label="Carregando mapa">
        <div className={styles.loading}>Carregando mapa…</div>
      </div>
    )
  }

  return (
    <div className={styles.panel} role="region" aria-label="Mapa de imóveis">
      <GoogleMap
        mapContainerClassName={styles.googleMap}
        center={center}
        zoom={13}
        options={MAP_OPTIONS}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={() => reportVisible(map)}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {points.map(({ property, position }) => (
                <Marker
                  key={property.id}
                  position={position}
                  clusterer={clusterer}
                  title={`${property.title} — ${formatMapPrice(property.price)}`}
                  label={{
                    text: formatMapPrice(property.price),
                    color: '#1a1a1a',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 18,
                    fillColor: hoveredId === property.id ? '#eff6ff' : '#ffffff',
                    fillOpacity: 1,
                    strokeColor: '#2563eb',
                    strokeWeight: hoveredId === property.id ? 3 : 2,
                    labelOrigin: new google.maps.Point(0, 0),
                  }}
                  onMouseOver={() => showBalloon(property.id)}
                  onMouseOut={scheduleHideBalloon}
                  onClick={() => {
                    window.location.assign(`/imoveis/${property.id}`)
                  }}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

        {hovered && (
          <InfoWindow
            position={hovered.position}
            options={{ disableAutoPan: true, pixelOffset: new google.maps.Size(0, -36) }}
            onCloseClick={() => setHoveredId(null)}
          >
            <div
              onMouseEnter={() => showBalloon(hovered.property.id)}
              onMouseLeave={scheduleHideBalloon}
            >
              <HoverBalloon property={hovered.property} />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <MapOverlays
        typeLabel={typeLabel}
        neighborhood={neighborhood}
        city={city}
        onClearType={onClearType}
        onDraw={handleDraw}
        onZoomIn={() => map?.setZoom((map.getZoom() ?? 13) + 1)}
        onZoomOut={() => map?.setZoom((map.getZoom() ?? 13) - 1)}
        zoomEnabled={!!map}
      />
    </div>
  )
}

export function MapPanel(props: MapPanelProps) {
  if (!hasGoogleMaps) {
    return (
      <div className={styles.panel} role="region" aria-label="Mapa de imóveis">
        <FakeMapSurface properties={props.properties} />
        <MapOverlays
          typeLabel={props.typeLabel}
          neighborhood={props.neighborhood}
          city={props.city}
          onClearType={props.onClearType}
          onDraw={() => window.alert('Desenhar área de busca estará disponível em breve.')}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          zoomEnabled={false}
        />
      </div>
    )
  }

  return <GoogleMapPanel {...props} />
}
