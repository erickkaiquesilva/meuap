import { useListings, useListingsFilters } from '../hooks/useListings'
import { FilterPanel } from '../components/FilterPanel/FilterPanel'
import { PropertyList } from '../components/PropertyList/PropertyList'
import { SearchContextBar } from '../components/SearchContextBar/SearchContextBar'
import { Pagination } from '../components/Pagination/Pagination'
import type { SearchFilters } from '@/shared/types/property'
import styles from './ListingsPage.module.css'

function countActiveFilters(filters: SearchFilters): number {
  return [
    filters.op,
    filters.city,
    filters.neighborhood,
    filters.type,
    filters.maxPrice,
    filters.minPrice,
    filters.bedrooms,
    filters.bathrooms,
    filters.parkingSpots,
    filters.minArea,
    filters.maxArea,
    filters.amenities,
  ].filter(Boolean).length
}

function buildLocationLabel(filters: SearchFilters): string {
  if (filters.neighborhood && filters.city) {
    return `${filters.neighborhood}, ${filters.city}`
  }
  if (filters.city) return filters.city
  if (filters.op === 'sale') return 'Imóveis à venda'
  if (filters.op === 'rent') return 'Imóveis para alugar'
  return 'Imóveis'
}

function resultNoun(filters: SearchFilters): string {
  if (filters.type === 'house') return 'casa'
  if (filters.type === 'commercial') return 'imóvel comercial'
  if (filters.type === 'studio') return 'kitnet/studio'
  return 'apartamento'
}

export function ListingsPage() {
  const { filters, setFilters, setPage, resetFilters } = useListingsFilters()
  const { data, isLoading, isError, refetch } = useListings(filters)

  const page = Number(filters.page ?? 1)
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 0
  const properties = data?.data ?? []
  const activeCount = countActiveFilters(filters)

  return (
    <div className={styles.page}>
      <SearchContextBar
        locationLabel={buildLocationLabel(filters)}
        total={total}
        isLoading={isLoading}
        resultNoun={resultNoun(filters)}
        sort={filters.sort ?? 'relevant'}
        onSortChange={(val) => setFilters({ sort: val })}
      />

      <div className={styles.mobileFilters}>
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          activeCount={activeCount}
        />
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            activeCount={activeCount}
          />
        </aside>

        <div className={styles.content}>
          <PropertyList
            properties={properties}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
