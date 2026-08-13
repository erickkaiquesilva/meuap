import styles from './SortSelect.module.css'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Mais relevantes' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'area-desc', label: 'Maior área' },
  { value: 'newest', label: 'Mais recentes' },
]

interface SortSelectProps {
  value: string
  onChange: (val: string) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="sort-select" className={styles.label}>↕</label>
      <select
        id="sort-select"
        className={styles.select}
        value={value || 'relevant'}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Ordenar resultados"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
