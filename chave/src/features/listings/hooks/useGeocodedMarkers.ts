import { useEffect, useRef, useState } from 'react'
import type { Property } from '@/shared/types/property'
import { geocodeProperty, getCachedCoords, getCityCenter } from '@/shared/utils/propertyCoords'

export type MarkerPoint = {
  property: Property
  position: { lat: number; lng: number }
}

function seedPoints(properties: Property[]): MarkerPoint[] {
  return properties.map((property) => ({
    property,
    position: getCachedCoords(property) ?? getCityCenter(property.city),
  }))
}

export function useGeocodedMarkers(
  properties: Property[],
  mapsReady: boolean,
): { points: MarkerPoint[]; ready: boolean } {
  const ids = properties.map((p) => p.id).join(',')
  const [points, setPoints] = useState<MarkerPoint[]>(() => seedPoints(properties))
  const [ready, setReady] = useState(false)
  const propsRef = useRef(properties)
  propsRef.current = properties

  useEffect(() => {
    const list = propsRef.current
    setPoints(seedPoints(list))
    setReady(false)

    if (!mapsReady || typeof google === 'undefined' || !google.maps?.Geocoder) {
      setReady(true)
      return
    }

    let cancelled = false
    const geocoder = new google.maps.Geocoder()

    async function run() {
      const next: MarkerPoint[] = []
      for (const property of list) {
        if (cancelled) return
        const position = await geocodeProperty(geocoder, property)
        next.push({ property, position })
      }
      if (!cancelled) {
        setPoints(next)
        setReady(true)
      }
    }

    void run()
    return () => { cancelled = true }
  }, [ids, mapsReady])

  return { points, ready }
}
