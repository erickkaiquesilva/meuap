import { useState, type FormEvent } from 'react'
import type { SearchFilters } from '@/shared/types/property'
import { FilterChip, MoreFiltersChip } from '../FilterChip/FilterChip'
import styles from './SearchFilterBar.module.css'

const OP_OPTIONS = [
  { value: 'rent', label: 'Alugar' },
  { value: 'sale', label: 'Comprar' },
]

const TYPE_OPTIONS = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'studio', label: 'Kitnet/Studio' },
  { value: 'commercial', label: 'Comercial' },
]

const COUNT_OPTIONS = [
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

const AREA_OPTIONS = [
  { value: '40', label: 'Até 40 m²' },
  { value: '60', label: 'Até 60 m²' },
  { value: '80', label: 'Até 80 m²' },
  { value: '120', label: 'Até 120 m²' },
]

interface SearchFilterBarProps {
  filters: SearchFilters
  onFilterChange: (next: Partial<SearchFilters>) => void
  locationPlaceholder: string
}

export function SearchFilterBar({ filters, onFilterChange, locationPlaceholder }: SearchFilterBarProps) {
  const [query, setQuery] = useState(
    [filters.neighborhood, filters.city].filter(Boolean).join(', '),
  )

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const parts = query.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 2) {
      onFilterChange({ neighborhood: parts[0], city: parts[1] })
    } else if (parts.length === 1) {
      // Treat single token as city or neighborhood
      const knownCities = ['Maringá', 'Sarandi']
      const match = knownCities.find((c) => c.toLowerCase() === parts[0].toLowerCase())
      if (match) onFilterChange({ city: match, neighborhood: undefined })
      else onFilterChange({ neighborhood: parts[0] })
    }
  }

  function handleAlert() {
    window.alert('Em breve você poderá criar alertas para esta busca.')
  }

  const moreCount = [filters.minPrice, filters.maxPrice, filters.minArea].filter(Boolean).length

  return (
    <div className={styles.bar}>
      <form className={styles.searchRow} onSubmit={handleSearch}>
        <label className={styles.searchPill}>
          <SearchIcon />
          <span className={styles.srOnly}>Buscar localização</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locationPlaceholder}
            aria-label="Buscar localização"
          />
        </label>
      </form>

      <div className={styles.chipsRow}>
        <div className={styles.chipsScroll}>
          <FilterChip
            label="Alugar"
            value={filters.op}
            options={OP_OPTIONS}
            onChange={(v) => onFilterChange({ op: v as 'rent' | 'sale' | undefined })}
          />
          <FilterChip
            label="Apartamento"
            value={filters.type}
            options={TYPE_OPTIONS}
            onChange={(v) => onFilterChange({ type: v })}
          />
          <FilterChip
            label="Quartos"
            value={filters.bedrooms}
            options={COUNT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} quartos` }))}
            onChange={(v) => onFilterChange({ bedrooms: v })}
          />
          <FilterChip
            label="Vagas de garagem"
            value={filters.parkingSpots}
            options={COUNT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} vagas` }))}
            onChange={(v) => onFilterChange({ parkingSpots: v })}
          />
          <FilterChip
            label="Banheiros"
            value={filters.bathrooms}
            options={COUNT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} banheiros` }))}
            onChange={(v) => onFilterChange({ bathrooms: v })}
          />
          <FilterChip
            label="Área"
            value={filters.maxArea}
            options={AREA_OPTIONS}
            onChange={(v) => onFilterChange({ maxArea: v })}
          />
          <AmenityToggle
            label="Mobiliado"
            value="Mobiliado"
            amenities={filters.amenities}
            onChange={(next) => onFilterChange({ amenities: next })}
          />
          <AmenityToggle
            label="Aceita pets"
            value="Aceita pet"
            amenities={filters.amenities}
            onChange={(next) => onFilterChange({ amenities: next })}
          />
          <AmenityToggle
            label="Próximo ao metrô"
            value="Perto de metrô"
            amenities={filters.amenities}
            onChange={(next) => onFilterChange({ amenities: next })}
          />
          <MoreFiltersChip activeCount={moreCount}>
            <label className={styles.moreField}>
              Preço mínimo
              <input
                type="number"
                min={0}
                className={styles.moreInput}
                value={filters.minPrice ?? ''}
                onChange={(e) => onFilterChange({ minPrice: e.target.value || undefined })}
              />
            </label>
            <label className={styles.moreField}>
              Preço máximo
              <input
                type="number"
                min={0}
                className={styles.moreInput}
                value={filters.maxPrice ?? ''}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value || undefined })}
              />
            </label>
            <label className={styles.moreField}>
              Área mínima (m²)
              <input
                type="number"
                min={0}
                className={styles.moreInput}
                value={filters.minArea ?? ''}
                onChange={(e) => onFilterChange({ minArea: e.target.value || undefined })}
              />
            </label>
          </MoreFiltersChip>
        </div>

        <button type="button" className={styles.alertBtn} onClick={handleAlert}>
          <BellIcon />
          Criar alerta de imóvel
        </button>
      </div>
    </div>
  )
}

function AmenityToggle({
  label,
  value,
  amenities,
  onChange,
}: {
  label: string
  value: string
  amenities?: string
  onChange: (next: string | undefined) => void
}) {
  const list = amenities ? amenities.split(',').filter(Boolean) : []
  const active = list.includes(value)

  return (
    <button
      type="button"
      className={`${styles.toggleChip} ${active ? styles.toggleActive : ''}`}
      aria-pressed={active}
      onClick={() => {
        const next = active ? list.filter((a) => a !== value) : [...list, value]
        onChange(next.length ? next.join(',') : undefined)
      }}
    >
      {label}
    </button>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
