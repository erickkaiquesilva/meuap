import { useState, type FormEvent } from 'react'
import type { SearchFilters } from '@/shared/types/property'
import { AlertModal } from '../AlertModal/AlertModal'
import { FilterChip } from '../FilterChip/FilterChip'
import { MoreFiltersDrawer } from '../MoreFiltersDrawer/MoreFiltersDrawer'
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
  const [alertOpen, setAlertOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const parts = query.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 2) {
      onFilterChange({ neighborhood: parts[0], city: parts[1] })
    } else if (parts.length === 1) {
      const knownCities = ['Maringá', 'Sarandi']
      const match = knownCities.find((c) => c.toLowerCase() === parts[0]!.toLowerCase())
      if (match) onFilterChange({ city: match, neighborhood: undefined })
      else onFilterChange({ neighborhood: parts[0], city: undefined })
    } else {
      onFilterChange({ city: undefined, neighborhood: undefined })
    }
  }

  const moreCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.minArea,
    filters.bathrooms,
    filters.amenities,
  ].filter(Boolean).length

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
            label="Alugar/Comprar"
            value={filters.op}
            options={OP_OPTIONS}
            onChange={(v) => onFilterChange({ op: v as 'rent' | 'sale' | undefined })}
          />
          <FilterChip
            label="Tipo de imóvel"
            value={filters.type}
            options={TYPE_OPTIONS}
            onChange={(v) => onFilterChange({ type: v })}
          />
          <FilterChip
            label="Área"
            value={filters.maxArea}
            options={AREA_OPTIONS}
            onChange={(v) => onFilterChange({ maxArea: v })}
          />
          <FilterChip
            label="Vagas de garagem"
            value={filters.parkingSpots}
            options={COUNT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} vagas` }))}
            onChange={(v) => onFilterChange({ parkingSpots: v })}
          />
          <FilterChip
            label="Quartos"
            value={filters.bedrooms}
            options={COUNT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} quartos` }))}
            onChange={(v) => onFilterChange({ bedrooms: v })}
          />
          <MoreFiltersDrawer
            open={moreOpen}
            activeCount={moreCount}
            onOpen={() => setMoreOpen(true)}
            onClose={() => setMoreOpen(false)}
          >
            <label className={styles.moreField}>
              Alugar / Comprar
              <select
                className={styles.moreInput}
                value={filters.op ?? ''}
                onChange={(e) =>
                  onFilterChange({
                    op: (e.target.value || undefined) as 'rent' | 'sale' | undefined,
                  })
                }
              >
                <option value="">Qualquer</option>
                {OP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.moreField}>
              Tipo de imóvel
              <select
                className={styles.moreInput}
                value={filters.type ?? ''}
                onChange={(e) => onFilterChange({ type: e.target.value || undefined })}
              >
                <option value="">Qualquer</option>
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.moreField}>
              Quartos (mín.)
              <select
                className={styles.moreInput}
                value={filters.bedrooms ?? ''}
                onChange={(e) => onFilterChange({ bedrooms: e.target.value || undefined })}
              >
                <option value="">Qualquer</option>
                {COUNT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.moreField}>
              Banheiros (mín.)
              <select
                className={styles.moreInput}
                value={filters.bathrooms ?? ''}
                onChange={(e) => onFilterChange({ bathrooms: e.target.value || undefined })}
              >
                <option value="">Qualquer</option>
                {COUNT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.moreField}>
              Vagas (mín.)
              <select
                className={styles.moreInput}
                value={filters.parkingSpots ?? ''}
                onChange={(e) => onFilterChange({ parkingSpots: e.target.value || undefined })}
              >
                <option value="">Qualquer</option>
                {COUNT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.moreField}>
              Área máxima (m²)
              <select
                className={styles.moreInput}
                value={filters.maxArea ?? ''}
                onChange={(e) => onFilterChange({ maxArea: e.target.value || undefined })}
              >
                <option value="">Qualquer</option>
                {AREA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
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
            <div className={styles.amenityRow}>
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
            </div>
          </MoreFiltersDrawer>
        </div>

        <button type="button" className={styles.alertBtn} onClick={() => setAlertOpen(true)}>
          <BellIcon />
          Criar alerta de imóvel
        </button>
      </div>

      <AlertModal open={alertOpen} filters={filters} onClose={() => setAlertOpen(false)} />
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
