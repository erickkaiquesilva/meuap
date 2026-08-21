import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { MyListing } from '../../types/listings'
import {
  DELETE_LISTING_REASONS,
  type DeleteListingReason,
} from '../../types/listings'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useDeleteMyListing } from '../../hooks/useMyListings'
import styles from './MyListingCard.module.css'

function formatPrice(listing: MyListing): string {
  const formatted = listing.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
  return listing.operation === 'rent' ? `${formatted}/mês` : formatted
}

interface MyListingCardProps {
  listing: MyListing
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<DeleteListingReason | null>(null)
  const [error, setError] = useState('')
  const deleteMutation = useDeleteMyListing()

  async function confirmDelete() {
    if (!reason) {
      setError('Selecione um motivo')
      return
    }
    setError('')
    try {
      await deleteMutation.mutateAsync({ id: listing.id, payload: { reason } })
      setOpen(false)
      setReason(null)
    } catch {
      setError('Não foi possível excluir. Tente novamente.')
    }
  }

  return (
    <>
      <article className={styles.card}>
        <div className={styles.photoWrap}>
          <img
            src={listing.photos[0]}
            alt=""
            className={styles.photo}
            loading="lazy"
          />
        </div>
        <div className={styles.body}>
          <p className={styles.price}>{formatPrice(listing)}</p>
          <h3 className={styles.title}>{listing.title}</h3>
          <p className={styles.meta}>
            {listing.bedrooms > 0 ? `${listing.bedrooms} quartos · ` : ''}
            {listing.neighborhood}, {listing.city}
          </p>
          <div className={styles.actions}>
            <Link to={`/imoveis/${listing.id}`} className={styles.viewBtn}>
              Ver
            </Link>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => setOpen(true)}
            >
              Excluir
            </button>
          </div>
        </div>
      </article>

      {open ? (
        <Modal title="Por que deseja excluir este anúncio?" onClose={() => setOpen(false)}>
          <p className={styles.modalLede}>
            Sua resposta nos ajuda a melhorar a Chave. O anúncio será removido.
          </p>
          <div role="radiogroup" aria-label="Motivo da exclusão" className={styles.reasons}>
            {DELETE_LISTING_REASONS.map(({ value, label }) => (
              <label key={value} className={styles.reason}>
                <input
                  type="radio"
                  name={`delete-reason-${listing.id}`}
                  checked={reason === value}
                  onChange={() => {
                    setReason(value)
                    setError('')
                  }}
                />
                {label}
              </label>
            ))}
          </div>
          {error ? <p className={styles.modalError} role="alert">{error}</p> : null}
          <div className={styles.modalActions}>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={confirmDelete}
            >
              Excluir anúncio
            </Button>
          </div>
        </Modal>
      ) : null}
    </>
  )
}
