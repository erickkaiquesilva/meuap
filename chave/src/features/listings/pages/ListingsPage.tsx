import { Link } from 'react-router-dom'
import { useListings, useListingsFilters } from '../hooks/useListings'
import { FilterPanel } from '../components/FilterPanel/FilterPanel'
import { PropertyGrid } from '../components/PropertyGrid/PropertyGrid'
import { SortSelect } from '../components/SortSelect/SortSelect'
import { Pagination } from '../components/Pagination/Pagination'
import type { SearchFilters } from '@/shared/types/property'
import styles from './ListingsPage.module.css'

function countActiveFilters(filters: SearchFilters): number {
  return [filters.op, filters.city, filters.neighborhood, filters.type, filters.maxPrice, filters.bedrooms]
    .filter(Boolean).length
}

export function ListingsPage() {
  const { filters, setFilters, setPage, resetFilters } = useListingsFilters()
  const { data, isLoading, isError, refetch } = useListings(filters)

  const page = Number(filters.page ?? 1)
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 0
  const properties = data?.data ?? []
  const activeCount = countActiveFilters(filters)

  const opLabel = filters.op === 'sale' ? 'Comprar' : filters.op === 'rent' ? 'Alugar' : 'Imóveis'
  const cityLabel = filters.city ? ` em ${filters.city}` : ''
  const pageTitle = `${opLabel}${cityLabel}`

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.pageHeader}>
        <nav className={styles.pageBreadcrumb} aria-label="Caminho">
          <Link to="/">Início</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Imóveis</span>
        </nav>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      {/* Mobile filter bar (renders inside FilterPanel on mobile) */}
      <div className={styles.mobileFilters}>
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          activeCount={activeCount}
        />
      </div>

      <div className={styles.layout}>
        {/* Desktop sidebar */}
        <aside className={styles.sidebar}>
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            activeCount={activeCount}
          />
        </aside>

        {/* Main content */}
        <div className={styles.content}>
          {/* Results bar */}
          <div className={styles.resultsBar}>
            <p className={styles.resultsCount}>
              {isLoading ? (
                'Buscando imóveis…'
              ) : (
                <>
                  <strong>{total}</strong>{' '}
                  {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                </>
              )}
            </p>
            <SortSelect
              value={filters.sort ?? 'relevant'}
              onChange={(val) => setFilters({ sort: val })}
            />
          </div>

          {/* Grid */}
          <PropertyGrid
            properties={properties}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />

          {/* Pagination */}
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
