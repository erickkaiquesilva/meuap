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
  { value: 'commercial', label: 'Comercial' },
]

const MAX_PRICE_OPTIONS = [
  { value: '', label: 'Qualquer' },
  { value: '800', label: 'R$ 800' },
  { value: '1200', label: 'R$ 1.200' },
  { value: '1800', label: 'R$ 1.800' },
  { value: '2500', label: 'R$ 2.500' },
  { value: '400000', label: 'R$ 400k' },
  { value: '600000', label: 'R$ 600k' },
  { value: '900000', label: 'R$ 900k' },
]

const BEDROOM_OPTIONS = ['1', '2', '3', '4']

interface FilterPanelProps {
  filters: SearchFilters
  onFilterChange: (next: Partial<SearchFilters>) => void
  onReset: () => void
  activeCount: number
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

  useEffect(() => {
    setCity(filters.city ?? '')
  }, [filters.city])

  function handleCityChange(val: string) {
    setCity(val)
    onFilterChange({ city: val || undefined, neighborhood: undefined })
  }

  const neighborhoods = city ? NEIGHBORHOODS[city] ?? [] : []

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

      {/* Type */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tipo</span>
        <div className={styles.chips}>
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`chip ${filters.type === t.value ? 'active' : ''}`}
              onClick={() => onFilterChange({ type: filters.type === t.value ? undefined : t.value })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Valor máximo</span>
        <select
          className={styles.select}
          value={filters.maxPrice ?? ''}
          onChange={(e) => onFilterChange({ maxPrice: e.target.value || undefined })}
          aria-label="Valor máximo"
        >
          {MAX_PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Quartos</span>
        <div className={styles.chips}>
          {BEDROOM_OPTIONS.map((b) => (
            <button
              key={b}
              type="button"
              className={`chip ${filters.bedrooms === b ? 'active' : ''}`}
              onClick={() => onFilterChange({ bedrooms: filters.bedrooms === b ? undefined : b })}
            >
              {b}+
            </button>
          ))}
        </div>
      </div>

      {onApply && (
        <div className={styles.drawerApply}>
          <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={onApply}>
            Ver resultados
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
      {/* Desktop sidebar panel */}
      <aside className={styles.panel} aria-label="Filtros">
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Filtros</span>
          {activeCount > 0 && (
            <button type="button" className={styles.resetBtn} onClick={onReset}>
              Limpar {activeCount > 0 ? `(${activeCount})` : ''}
            </button>
          )}
        </div>
        <FilterForm
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </aside>

      {/* Mobile filter bar */}
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

      {/* Mobile drawer */}
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
