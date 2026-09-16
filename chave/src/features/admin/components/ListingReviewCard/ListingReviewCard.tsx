import { useCallback, useState } from 'react'
import type { MyListing } from '@/features/announcer/types/listings'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import { formatCurrencyBrlCents } from '@/shared/utils/brMasks'
import { getApiErrorMessage } from '@/core/api/errors'
import styles from './ListingReviewCard.module.css'

interface ListingReviewCardProps {
  listing: MyListing
  onApprove: (id: string) => Promise<unknown>
  onReject: (id: string, reason: string) => Promise<unknown>
}

export function ListingReviewCard({ listing, onApprove, onReject }: ListingReviewCardProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    setReason('')
    setError('')
  }, [])

  async function confirmReject() {
    const trimmed = reason.trim()
    if (trimmed.length < 3) {
      setError('Descreva o motivo (mín. 3 caracteres)')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onReject(listing.id, trimmed)
      close()
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Não foi possível rejeitar. Tente novamente.'))
    } finally {
      setBusy(false)
    }
  }

  async function confirmApprove() {
    setBusy(true)
    setError('')
    try {
      await onApprove(listing.id)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Não foi possível aprovar. Tente novamente.'))
    } finally {
      setBusy(false)
    }
  }

  const price = formatCurrencyBrlCents(listing.price)

  return (
    <article className={styles.card}>
      <div>
        <h2 className={styles.title}>{listing.title}</h2>
        <p className={styles.meta}>
          {price}
          {listing.operation === 'rent' ? '/mês' : ''}
          {' · '}
          {listing.neighborhood}, {listing.city}
        </p>
        <p className={styles.description}>{listing.description}</p>
      </div>
      <div className={styles.actions}>
        <Button type="button" disabled={busy} onClick={() => { void confirmApprove() }}>
          Aprovar
        </Button>
        <Button
          type="button"
          variant="danger-outline"
          disabled={busy}
          onClick={() => setOpen(true)}
        >
          Rejeitar
        </Button>
      </div>
      {error && !open ? <p className={styles.error} role="alert">{error}</p> : null}

      {open ? (
        <Modal title="Motivo da rejeição" onClose={close}>
          <label className={styles.field}>
            <span>Por que este anúncio não pode ir ao ar?</span>
            <textarea
              value={reason}
              rows={3}
              placeholder="Ex.: fotos insuficientes"
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
            />
          </label>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.modalActions}>
            <Button type="button" variant="outline" disabled={busy} onClick={close}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" loading={busy} onClick={() => { void confirmReject() }}>
              Confirmar rejeição
            </Button>
          </div>
        </Modal>
      ) : null}
    </article>
  )
}
