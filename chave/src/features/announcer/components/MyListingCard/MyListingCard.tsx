import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { MyListing, OtherListingChannel } from '../../types/listings'
import {
  DELETE_LISTING_REASONS,
  OTHER_LISTING_CHANNELS,
  type DeleteListingReason,
} from '../../types/listings'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useDeleteMyListing } from '../../hooks/useMyListings'
import { formatCurrencyBrlCents } from '@/shared/utils/brMasks'
import styles from './MyListingCard.module.css'

function formatPrice(listing: MyListing): string {
  const formatted = formatCurrencyBrlCents(listing.price)
  return listing.operation === 'rent' ? `${formatted}/mês` : formatted
}

interface MyListingCardProps {
  listing: MyListing
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<DeleteListingReason | null>(null)
  const [otherDetail, setOtherDetail] = useState('')
  const [otherChannel, setOtherChannel] = useState<OtherListingChannel | null>(null)
  const [otherChannelDetail, setOtherChannelDetail] = useState('')
  const [error, setError] = useState('')
  const deleteMutation = useDeleteMyListing()

  function resetModal() {
    setOpen(false)
    setReason(null)
    setOtherDetail('')
    setOtherChannel(null)
    setOtherChannelDetail('')
    setError('')
  }

  async function confirmDelete() {
    if (!reason) {
      setError('Selecione um motivo')
      return
    }
    if (reason === 'other' && otherDetail.trim().length < 3) {
      setError('Descreva o motivo (mín. 3 caracteres)')
      return
    }
    if (reason === 'other_channel' && !otherChannel) {
      setError('Selecione o canal')
      return
    }
    if (
      reason === 'other_channel'
      && otherChannel === 'other'
      && otherChannelDetail.trim().length < 2
    ) {
      setError('Descreva o canal')
      return
    }

    setError('')
    try {
      await deleteMutation.mutateAsync({
        id: listing.id,
        payload: {
          reason,
          otherDetail: reason === 'other' ? otherDetail.trim() : undefined,
          otherChannel: reason === 'other_channel' ? otherChannel! : undefined,
          otherChannelDetail:
            reason === 'other_channel' && otherChannel === 'other'
              ? otherChannelDetail.trim()
              : undefined,
        },
      })
      resetModal()
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
            <Link to={`/anuncios/${listing.id}/editar`} className={styles.editBtn}>
              Editar
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
        <Modal title="Por que deseja excluir este anúncio?" onClose={resetModal}>
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
                    if (value !== 'other') setOtherDetail('')
                    if (value !== 'other_channel') {
                      setOtherChannel(null)
                      setOtherChannelDetail('')
                    }
                  }}
                />
                {label}
              </label>
            ))}
          </div>

          {reason === 'other_channel' ? (
            <div className={styles.followUp}>
              <p className={styles.followUpLabel} id={`channel-label-${listing.id}`}>
                Qual canal?
              </p>
              <div
                role="radiogroup"
                aria-labelledby={`channel-label-${listing.id}`}
                className={styles.reasons}
              >
                {OTHER_LISTING_CHANNELS.map(({ value, label }) => (
                  <label key={value} className={styles.reason}>
                    <input
                      type="radio"
                      name={`delete-channel-${listing.id}`}
                      checked={otherChannel === value}
                      onChange={() => {
                        setOtherChannel(value)
                        setError('')
                        if (value !== 'other') setOtherChannelDetail('')
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {otherChannel === 'other' ? (
                <label className={styles.textField}>
                  <span>Descreva o canal</span>
                  <input
                    type="text"
                    value={otherChannelDetail}
                    placeholder="Ex.: grupo de vizinhos"
                    onChange={(e) => {
                      setOtherChannelDetail(e.target.value)
                      setError('')
                    }}
                  />
                </label>
              ) : null}
            </div>
          ) : null}

          {reason === 'other' ? (
            <label className={styles.textField}>
              <span>Qual o motivo?</span>
              <textarea
                value={otherDetail}
                rows={3}
                placeholder="Conte em poucas palavras…"
                onChange={(e) => {
                  setOtherDetail(e.target.value)
                  setError('')
                }}
              />
            </label>
          ) : null}

          {error ? <p className={styles.modalError} role="alert">{error}</p> : null}
          <div className={styles.modalActions}>
            <Button type="button" variant="outline" onClick={resetModal}>
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
