import { useMemo, useState } from 'react'
import { useListingsFilters, useMapListings } from '../hooks/useListings'
import { SearchFilterBar } from '../components/SearchFilterBar/SearchFilterBar'
import { PropertyResultsGrid } from '../components/PropertyResultsGrid/PropertyResultsGrid'
import { MapPanel } from '../components/MapPanel/MapPanel'
import { NeighborhoodChips } from '../components/NeighborhoodChips/NeighborhoodChips'
import { SortSelect } from '../components/SortSelect/SortSelect'
import { RecommendationsBanner } from '../components/RecommendationsBanner/RecommendationsBanner'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  isRecommendationsCtaDismissed,
  shouldShowRecommendationsCta,
} from '../utils/recommendations'
import styles from './ListingsPage.module.css'

const TYPE_LABEL: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  studio: 'Kitnet/Studio',
  commercial: 'Comercial',
}

function resultNoun(type?: string): string {
  if (type === 'house') return 'casas'
  if (type === 'commercial') return 'imóveis comerciais'
  if (type === 'studio') return 'kitnets/studios'
  return 'apartamentos'
}

export function ListingsPage() {
  const { user, setWantRecommendations } = useAuth()
  const { filters, setFilters, resetFilters } = useListingsFilters()
  const { data, isLoading, isError, refetch } = useMapListings(filters)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list')

  const showRecCta =
    shouldShowRecommendationsCta(user)
    && !!user?.rentProfile
    && !isRecommendationsCtaDismissed()

  const properties = data?.data ?? []

  const city = filters.city ?? 'Maringá'
  const neighborhood = filters.neighborhood
  const locationPlaceholder = neighborhood && filters.city
    ? `${neighborhood}, ${filters.city} – PR, Brasil`
    : filters.city
      ? `${filters.city} – PR, Brasil`
      : 'Buscar bairro ou cidade'

  const subtitleClean = (() => {
    const parts: string[] = ['para alugar']
    if (neighborhood && filters.city) parts.push(`em ${neighborhood}, ${filters.city}, PR`)
    else if (filters.city) parts.push(`em ${filters.city}, PR`)
    else parts.push('em Maringá e Sarandi, PR')
    return parts.join(' ')
  })()

  const nearby = useMemo(() => {
    const cityName = filters.city ?? city
    const counts = new Map<string, number>()
    for (const p of properties) {
      if (p.city !== cityName) continue
      if (filters.op && p.operation !== filters.op) continue
      if (neighborhood && p.neighborhood === neighborhood) continue
      counts.set(p.neighborhood, (counts.get(p.neighborhood) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, city: cityName, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 8)
  }, [properties, filters.city, filters.op, neighborhood, city])

  return (
    <div className={styles.page}>
      <SearchFilterBar
        filters={filters}
        onFilterChange={setFilters}
        locationPlaceholder={locationPlaceholder}
      />

      <div className={styles.mobileToggle}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${mobileView === 'list' ? styles.toggleOn : ''}`}
          onClick={() => setMobileView('list')}
        >
          Ver lista
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${mobileView === 'map' ? styles.toggleOn : ''}`}
          onClick={() => setMobileView('map')}
        >
          Ver mapa
        </button>
      </div>

      <div className={styles.split}>
        <section
          className={`${styles.resultsCol} ${mobileView === 'map' ? styles.hideOnMobile : ''}`}
          aria-label="Resultados da busca"
        >
          <div className={styles.resultsInner}>
            {showRecCta && user?.rentProfile ? (
              <RecommendationsBanner
                profile={user.rentProfile}
                onApplyFilters={setFilters}
                onAccept={async () => {
                  await setWantRecommendations(true)
                }}
                onDecline={async () => {
                  await setWantRecommendations(false)
                }}
              />
            ) : null}

            <header className={styles.resultsHead}>
              <div>
                <h1 className={styles.resultsTitle}>
                  {isLoading ? '…' : properties.length} {resultNoun(filters.type)}
                </h1>
                <p className={styles.resultsSub}>{subtitleClean}</p>
              </div>
              <SortSelect
                value={filters.sort ?? 'relevant'}
                onChange={(val) => setFilters({ sort: val })}
              />
            </header>

            <PropertyResultsGrid
              properties={properties}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
            />

            <NeighborhoodChips
              currentNeighborhood={neighborhood}
              items={nearby}
            />

            {Object.keys(filters).some((k) => k !== 'page' && filters[k as keyof typeof filters]) && (
              <button type="button" className={styles.clearLink} onClick={resetFilters}>
                Limpar todos os filtros
              </button>
            )}
          </div>
        </section>

        <aside
          className={`${styles.mapCol} ${mobileView === 'list' ? styles.hideOnMobile : ''}`}
          aria-label="Mapa"
        >
          <MapPanel
            properties={properties}
            city={filters.city}
            neighborhood={neighborhood}
            typeLabel={filters.type ? TYPE_LABEL[filters.type] : undefined}
            onClearType={() => setFilters({ type: undefined })}
          />
        </aside>
      </div>
    </div>
  )
}
