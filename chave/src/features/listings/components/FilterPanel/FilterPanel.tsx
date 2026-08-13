import { useState, useEffect } from 'react'
import type { SearchFilters } from '@/shared/types/property'
import styles from './FilterPanel.module.css'

const CITIES = ['Maringá', 'Sarandi']

const NEIGHBORHOODS: Record<string, string[]> = {
  'Maringá': [
    'Zona 7', 'Centro', 'Jardim Alvorada', 'Jardim Universo',
    'Vila Operária', 'Zona 01', 'Zona 05',
  ],
  'Sarandi': [
    'Centro', 'Jardim Morumbi', 'Parque das Nações', 'Vila Nova',
  ],
}

const TYPE_OPTIONS = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'studio', label: 'Kitnet/Studio' },
  { value: 'commercial', label: 'Comercial' },
]

const CHIP_OPTIONS = ['1', '2', '3', '4']

const AMENITY_OPTIONS = [
  { value: 'Mobiliado', label: 'Mobiliado' },
  { value: 'Aceita pet', label: 'Aceita pet' },
  { value: 'Perto de metrô', label: 'Perto de metrô' },
]

const CONDO_OPTIONS = [
  { value: 'Piscina', label: 'Piscina' },
  { value: 'Academia', label: 'Academia' },
  { value: 'Playground', label: 'Playground' },
  { value: 'Portaria 24h', label: 'Portaria 24h' },
]

interface FilterPanelProps {
  filters: SearchFilters
  onFilterChange: (next: Partial<SearchFilters>) => void
  onReset: () => void
  activeCount: number
}

function parseAmenities(raw?: string): string[] {
  return raw ? raw.split(',').filter(Boolean) : []
}

function toggleAmenity(current: string | undefined, value: string): string | undefined {
  const list = parseAmenities(current)
  const next = list.includes(value)
    ? list.filter((a) => a !== value)
    : [...list, value]
  return next.length > 0 ? next.join(',') : undefined
}

function FilterForm({
  filters,
  onFilterChange,
  onApply,
}: {
  filters: SearchFilters
  onFilterChange: (next: Partial<SearchFilters>) => void
  onApply?: () => void
}) {
  const [city, setCity] = useState(filters.city ?? '')
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? '')
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? '')
  const [minArea, setMinArea] = useState(filters.minArea ?? '')
  const [maxArea, setMaxArea] = useState(filters.maxArea ?? '')

  useEffect(() => {
    setCity(filters.city ?? '')
    setMinPrice(filters.minPrice ?? '')
    setMaxPrice(filters.maxPrice ?? '')
    setMinArea(filters.minArea ?? '')
    setMaxArea(filters.maxArea ?? '')
  }, [filters.city, filters.minPrice, filters.maxPrice, filters.minArea, filters.maxArea])

  function handleCityChange(val: string) {
    setCity(val)
    onFilterChange({ city: val || undefined, neighborhood: undefined })
  }

  function commitPrice() {
    onFilterChange({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }

  function commitArea() {
    onFilterChange({
      minArea: minArea || undefined,
      maxArea: maxArea || undefined,
    })
  }

  const neighborhoods = city ? NEIGHBORHOODS[city] ?? [] : []
  const selectedAmenities = parseAmenities(filters.amenities)

  return (
    <>
      {/* Operation */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Operação</span>
        <div className={styles.opTabs}>
          {(['rent', 'sale'] as const).map((op) => (
            <button
              key={op}
              type="button"
              className={`${styles.opTab} ${filters.op === op ? styles.opTabActive : ''}`}
              onClick={() => onFilterChange({ op: filters.op === op ? undefined : op })}
            >
              {op === 'rent' ? 'Alugar' : 'Comprar'}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Cidade</span>
        <select
          className={styles.select}
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          aria-label="Cidade"
        >
          <option value="">Todas as cidades</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Neighborhood */}
      {neighborhoods.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Bairro</span>
          <select
            className={styles.select}
            value={filters.neighborhood ?? ''}
            onChange={(e) => onFilterChange({ neighborhood: e.target.value || undefined })}
            aria-label="Bairro"
          >
            <option value="">Todos os bairros</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      {/* Price range */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Faixa de preço (R$)</span>
        <div className={styles.priceRow}>
          <input
            className={styles.input}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Mín"
            aria-label="Preço mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => { if (e.key === 'Enter') commitPrice() }}
          />
          <input
            className={styles.input}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Máx"
            aria-label="Preço máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => { if (e.key === 'Enter') commitPrice() }}
          />
        </div>
      </div>

      {/* Type */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tipo de imóvel</span>
        <div className={styles.checkList} role="group" aria-label="Tipo de imóvel">
          {TYPE_OPTIONS.map((t) => (
            <label key={t.value} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.type === t.value}
                onChange={() => onFilterChange({ type: filters.type === t.value ? undefined : t.value })}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms / Bathrooms / Parking */}
      {([
        { key: 'bedrooms' as const, label: 'Quartos' },
        { key: 'bathrooms' as const, label: 'Banheiros' },
        { key: 'parkingSpots' as const, label: 'Vagas' },
      ]).map(({ key, label }) => (
        <div key={key} className={styles.section}>
          <span className={styles.sectionLabel}>{label}</span>
          <div className={styles.chips}>
            {CHIP_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                className={`chip ${filters[key] === n ? 'active' : ''}`}
                onClick={() => onFilterChange({ [key]: filters[key] === n ? undefined : n })}
              >
                {n}+
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Area */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Área (m²)</span>
        <div className={styles.priceRow}>
          <input
            className={styles.input}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Mín"
            aria-label="Área mínima"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            onBlur={commitArea}
            onKeyDown={(e) => { if (e.key === 'Enter') commitArea() }}
          />
          <input
            className={styles.input}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Máx"
            aria-label="Área máxima"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            onBlur={commitArea}
            onKeyDown={(e) => { if (e.key === 'Enter') commitArea() }}
          />
        </div>
      </div>

      {/* Amenities */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Comodidades</span>
        <div className={styles.checkList} role="group" aria-label="Comodidades">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a.value} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a.value)}
                onChange={() => onFilterChange({ amenities: toggleAmenity(filters.amenities, a.value) })}
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>

      {/* Condo features */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Condomínio</span>
        <div className={styles.checkList} role="group" aria-label="Características do condomínio">
          {CONDO_OPTIONS.map((a) => (
            <label key={a.value} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a.value)}
                onChange={() => onFilterChange({ amenities: toggleAmenity(filters.amenities, a.value) })}
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>

      {onApply && (
        <div className={styles.drawerApply}>
          <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={onApply}>
            Aplicar filtros
          </button>
        </div>
      )}
    </>
  )
}

export function FilterPanel({ filters, onFilterChange, onReset, activeCount }: FilterPanelProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <aside className={styles.panel} aria-label="Filtros">
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Filtros</span>
          {activeCount > 0 && (
            <button type="button" className={styles.resetBtn} onClick={onReset}>
              Limpar ({activeCount})
            </button>
          )}
        </div>
        <FilterForm filters={filters} onFilterChange={onFilterChange} />
      </aside>

      <div className={styles.mobileBar} role="toolbar" aria-label="Filtros rápidos">
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCount > 0 ? styles.filterBtnActive : ''}`}
          onClick={() => setDrawerOpen(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filtros {activeCount > 0 ? `(${activeCount})` : ''}
        </button>

        {filters.op && (
          <button type="button" className={`${styles.filterBtn} ${styles.filterBtnActive}`} onClick={() => onFilterChange({ op: undefined })}>
            {filters.op === 'rent' ? 'Alugar' : 'Comprar'} ×
          </button>
        )}
        {filters.city && (
          <button type="button" className={`${styles.filterBtn} ${styles.filterBtnActive}`} onClick={() => onFilterChange({ city: undefined, neighborhood: undefined })}>
            {filters.city} ×
          </button>
        )}
        {filters.type && (
          <button type="button" className={`${styles.filterBtn} ${styles.filterBtnActive}`} onClick={() => onFilterChange({ type: undefined })}>
            {TYPE_OPTIONS.find((t) => t.value === filters.type)?.label} ×
          </button>
        )}
        {filters.bedrooms && (
          <button type="button" className={`${styles.filterBtn} ${styles.filterBtnActive}`} onClick={() => onFilterChange({ bedrooms: undefined })}>
            {filters.bedrooms}+ quartos ×
          </button>
        )}
      </div>

      {drawerOpen && (
        <>
          <div className={styles.drawerOverlay} aria-hidden="true" onClick={() => setDrawerOpen(false)} />
          <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filtros">
            <div className={styles.drawerHandle} />
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Filtros</span>
              {activeCount > 0 && (
                <button type="button" className={styles.resetBtn} onClick={() => { onReset(); setDrawerOpen(false) }}>
                  Limpar ({activeCount})
                </button>
              )}
            </div>
            <FilterForm
              filters={filters}
              onFilterChange={onFilterChange}
              onApply={() => setDrawerOpen(false)}
            />
          </div>
        </>
      )}
    </>
  )
}
