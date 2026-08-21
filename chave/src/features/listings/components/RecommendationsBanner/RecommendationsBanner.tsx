import { useState } from 'react'
import type { RentProfile } from '@/features/auth/types/auth'
import type { SearchFilters } from '@/shared/types/property'
import { Button } from '@/shared/components/Button/Button'
import {
  dismissRecommendationsCta,
  filtersFromRentProfile,
} from '../../utils/recommendations'
import styles from './RecommendationsBanner.module.css'

interface RecommendationsBannerProps {
  profile: RentProfile
  onApplyFilters: (next: Partial<SearchFilters>) => void
  onAccept: () => Promise<void>
  onDecline: () => Promise<void>
}

export function RecommendationsBanner({
  profile,
  onApplyFilters,
  onAccept,
  onDecline,
}: RecommendationsBannerProps) {
  const [busy, setBusy] = useState(false)
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  async function handleYes() {
    setBusy(true)
    try {
      await onAccept()
      onApplyFilters(filtersFromRentProfile(profile))
      setHidden(true)
    } finally {
      setBusy(false)
    }
  }

  async function handleNo() {
    setBusy(true)
    try {
      await onDecline()
      dismissRecommendationsCta()
      setHidden(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className={styles.banner} aria-label="Recomendações com base no perfil">
      <strong className={styles.title}>
        Quer que recomende a você imóveis com base no seu perfil?
      </strong>
      <span className={styles.lede}>
        Usamos cidade, orçamento e quartos que você informou no cadastro.
      </span>
      <div className={styles.actions}>
        <Button type="button" loading={busy} onClick={handleYes}>
          Sim, recomendar
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={handleNo}>
          Agora não
        </Button>
      </div>
    </aside>
  )
}
