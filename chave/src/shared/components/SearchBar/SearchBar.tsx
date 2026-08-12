import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchFilters } from '@/shared/hooks/useSearchFilters'
import { fetchNeighborhoods } from '@/features/home/services/homeApi'
import type { SearchFilters } from '@/shared/types/property'
import styles from './SearchBar.module.css'

const MAX_PRICE_OPTIONS = [
  { value: '', label: 'Qualquer' },
  { value: '800', label: 'Até R$ 800' },
  { value: '1200', label: 'Até R$ 1.200' },
  { value: '1800', label: 'Até R$ 1.800' },
  { value: '2500', label: 'Até R$ 2.500' },
  { value: '400000', label: 'Até R$ 400.000' },
  { value: '600000', label: 'Até R$ 600.000' },
]

const BEDROOM_OPTIONS = [
  { value: '', label: 'Qualquer' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

interface SearchBarProps {
  compact?: boolean
  initialFilters?: SearchFilters
}

export function SearchBar({ compact = false, initialFilters }: SearchBarProps) {
  const { navigateToListings, setFilters } = useSearchFilters()

  const [op, setOp] = useState<'rent' | 'sale'>(initialFilters?.op ?? 'rent')
  const [city, setCity] = useState(initialFilters?.city ?? '')
  const [neighborhood, setNeighborhood] = useState(initialFilters?.neighborhood ?? '')
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice ?? '')
  const [bedrooms, setBedrooms] = useState(initialFilters?.bedrooms ?? '')
  const [cityError, setCityError] = useState('')

  const { data: neighborhoods = [] } = useQuery({
    queryKey: ['neighborhoods', city],
    queryFn: () => fetchNeighborhoods(city || undefined),
    enabled: true,
  })

  // Reset neighborhood when city changes
  useEffect(() => {
    setNeighborhood('')
  }, [city])

  function handleSearch() {
    if (!city) {
      setCityError('Selecione uma cidade')
      return
    }
    setCityError('')

    const filters: SearchFilters = { op, city }
    if (neighborhood) filters.neighborhood = neighborhood
    if (maxPrice) filters.maxPrice = maxPrice
    if (bedrooms) filters.bedrooms = bedrooms

    if (compact) {
      setFilters(filters)
    } else {
      navigateToListings(filters)
    }
  }

  const filteredNeighborhoods = city
    ? neighborhoods.filter((n) => n.city === city)
    : neighborhoods

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
      {/* Operation tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Tipo de operação">
        <button
          role="tab"
          aria-selected={op === 'rent'}
          className={`${styles.tab} ${op === 'rent' ? styles.tabActive : ''}`}
          onClick={() => setOp('rent')}
          type="button"
        >
          Alugar
        </button>
        <button
          role="tab"
          aria-selected={op === 'sale'}
          className={`${styles.tab} ${op === 'sale' ? styles.tabActive : ''}`}
          onClick={() => setOp('sale')}
          type="button"
        >
          Comprar
        </button>
      </div>

      {/* Filter fields */}
      <div className={styles.fields}>
        {/* City */}
        <div className={`field ${cityError ? 'error' : ''} ${styles.fieldItem}`}>
          <label htmlFor="sb-city" className={styles.fieldLabel}>Cidade</label>
          <div className="control">
            <select
              id="sb-city"
              value={city}
              onChange={(e) => { setCity(e.target.value); setCityError('') }}
              aria-describedby={cityError ? 'sb-city-error' : undefined}
            >
              <option value="">Selecione</option>
              <option value="Maringá">Maringá</option>
              <option value="Sarandi">Sarandi</option>
            </select>
          </div>
          {cityError && (
            <span id="sb-city-error" className="help-error" role="alert">
              {cityError}
            </span>
          )}
        </div>

        {/* Neighborhood */}
        <div className={`field ${styles.fieldItem}`}>
          <label htmlFor="sb-neighborhood" className={styles.fieldLabel}>Bairro</label>
          <div className="control">
            <select
              id="sb-neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              disabled={!city}
            >
              <option value="">Todos os bairros</option>
              {filteredNeighborhoods.map((n) => (
                <option key={n.id} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Max price */}
        <div className={`field ${styles.fieldItem}`}>
          <label htmlFor="sb-price" className={styles.fieldLabel}>Valor máx.</label>
          <div className="control">
            <select id="sb-price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              {MAX_PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bedrooms */}
        <div className={`field ${styles.fieldItem}`}>
          <label htmlFor="sb-bedrooms" className={styles.fieldLabel}>Quartos</label>
          <div className="control">
            <select id="sb-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
              {BEDROOM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <button
          type="button"
          className={`btn btn-primary ${styles.searchBtn}`}
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
    </div>
  )
}
