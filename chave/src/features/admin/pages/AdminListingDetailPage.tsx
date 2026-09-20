import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  useApproveListing,
  useModerationQueue,
  useRejectListing,
} from '../hooks/useModerationQueue'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import { formatCurrencyBrlCents } from '@/shared/utils/brMasks'
import { getApiErrorMessage } from '@/core/api/errors'
import styles from './AdminListingDetailPage.module.css'

const TYPE_LABEL: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Comercial',
}

export function AdminListingDetailPage() {
  const { listingId = '' } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useModerationQueue()
  const approve = useApproveListing()
  const reject = useRejectListing()

  const listing = useMemo(
    () => (data ?? []).find((item) => item.id === listingId),
    [data, listingId],
  )

  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  async function confirmApprove() {
    if (!listing) return
    setBusy(true)
    setError('')
    try {
      await approve.mutateAsync(listing.id)
      navigate('/admin', { replace: true })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Não foi possível aprovar. Tente novamente.'))
    } finally {
      setBusy(false)
    }
  }

  async function confirmReject() {
    if (!listing) return
    const trimmed = reason.trim()
    if (trimmed.length < 3) {
      setError('Descreva o motivo (mín. 3 caracteres)')
      return
    }
    setBusy(true)
    setError('')
    try {
      await reject.mutateAsync({ id: listing.id, reason: trimmed })
      navigate('/admin', { replace: true })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Não foi possível rejeitar. Tente novamente.'))
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.state}>Carregando anúncio…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.state}>
          <p>Não foi possível carregar o anúncio.</p>
          <Button type="button" variant="outline" onClick={() => { void refetch() }}>
            Tentar de novo
          </Button>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className={styles.page}>
        <p className={styles.state}>Anúncio não encontrado na fila.</p>
        <Link to="/admin" className={styles.back}>
          Voltar à fila
        </Link>
      </div>
    )
  }

  const photos = listing.photos ?? []
  const price = formatCurrencyBrlCents(listing.price)
  const photo = photos[activePhoto] ?? photos[0]

  return (
    <div className={styles.page}>
      <Link to="/admin" className={styles.back}>
        ← Voltar à fila
      </Link>

      <header className={styles.head}>
        <h1 className={styles.title}>{listing.title}</h1>
        <p className={styles.meta}>
          {price}
          {listing.operation === 'rent' ? '/mês' : ''}
          {' · '}
          {TYPE_LABEL[listing.type] ?? listing.type}
          {' · '}
          {listing.operation === 'rent' ? 'Aluguel' : 'Venda'}
        </p>
      </header>

      <section className={styles.gallery} aria-label="Fotos do anúncio">
        {photo ? (
          <img src={photo} alt={`Foto ${activePhoto + 1} de ${listing.title}`} className={styles.hero} />
        ) : (
          <div className={styles.emptyPhoto}>Sem fotos cadastradas</div>
        )}
        {photos.length > 1 ? (
          <div className={styles.thumbs}>
            {photos.map((src, index) => (
              <button
                key={`${src.slice(0, 32)}-${index}`}
                type="button"
                className={`${styles.thumb} ${index === activePhoto ? styles.thumbActive : ''}`}
                onClick={() => setActivePhoto(index)}
                aria-label={`Ver foto ${index + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.details} aria-label="Detalhes do anúncio">
        <dl className={styles.grid}>
          <div>
            <dt>Endereço</dt>
            <dd>
              {listing.address}
              <br />
              {listing.neighborhood}, {listing.city}
            </dd>
          </div>
          <div>
            <dt>Quartos</dt>
            <dd>{listing.bedrooms}</dd>
          </div>
          <div>
            <dt>Banheiros</dt>
            <dd>{listing.bathrooms}</dd>
          </div>
          <div>
            <dt>Vagas</dt>
            <dd>{listing.parkingSpots}</dd>
          </div>
          <div>
            <dt>Área</dt>
            <dd>{listing.area} m²</dd>
          </div>
          <div>
            <dt>Comodidades</dt>
            <dd>
              {listing.amenities.length > 0
                ? listing.amenities.join(', ')
                : 'Nenhuma informada'}
            </dd>
          </div>
        </dl>
        <div className={styles.descriptionBlock}>
          <h2 className={styles.sectionTitle}>Descrição</h2>
          <p className={styles.description}>{listing.description}</p>
        </div>
      </section>

      <div className={styles.actions}>
        <Button type="button" disabled={busy} onClick={() => { void confirmApprove() }}>
          Aprovar
        </Button>
        <Button
          type="button"
          variant="danger-outline"
          disabled={busy}
          onClick={() => {
            setRejectOpen(true)
            setError('')
          }}
        >
          Rejeitar
        </Button>
      </div>
      {error && !rejectOpen ? <p className={styles.error} role="alert">{error}</p> : null}

      {rejectOpen ? (
        <Modal
          title="Motivo da rejeição"
          onClose={() => {
            setRejectOpen(false)
            setReason('')
            setError('')
          }}
        >
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
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setRejectOpen(false)
                setReason('')
                setError('')
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={busy}
              onClick={() => { void confirmReject() }}
            >
              Confirmar rejeição
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
