import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { getApiErrorCode, getApiErrorMessage } from '@/core/api/errors'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import type { Property } from '@/shared/types/property'
import { createVisit } from '../../api/visitsApi'
import { buildAvailableSlots } from '../../utils/visitSlots'
import styles from './VisitScheduler.module.css'

interface VisitSchedulerProps {
  property: Property
  open: boolean
  onClose: () => void
}

export function VisitScheduler({ property, open, onClose }: VisitSchedulerProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const slots = useMemo(
    () =>
      buildAvailableSlots({
        visitMode: property.visitMode,
        visitSchedule: property.visitSchedule,
      }),
    [property.visitMode, property.visitSchedule],
  )

  const close = useCallback(() => {
    setSelectedId(null)
    setError('')
    setSuccess(false)
    onClose()
  }, [onClose])

  const book = useMutation({
    mutationFn: createVisit,
    onSuccess: () => {
      setSuccess(true)
      setError('')
    },
    onError: (err: unknown) => {
      if (getApiErrorCode(err) === 'SLOT_UNAVAILABLE') {
        setError('Horário indisponível — escolha outro')
        return
      }
      setError(getApiErrorMessage(err, 'Não foi possível agendar a visita.'))
    },
  })

  if (!open) return null

  function ensureAuth(): boolean {
    if (isLoading) return false
    if (!isAuthenticated) {
      const returnTo = `${location.pathname}${location.search}`
      navigate(`/entrar?redirect=${encodeURIComponent(returnTo)}`)
      return false
    }
    return true
  }

  function handleConfirm() {
    if (!ensureAuth()) return
    const slot = slots.find((item) => item.id === selectedId)
    if (!slot) {
      setError('Selecione um horário disponível')
      return
    }
    setError('')
    book.mutate({
      listingId: property.id,
      slotStart: slot.slotStart,
      slotEnd: slot.slotEnd,
    })
  }

  return (
    <Modal title="Agendar visita" onClose={close}>
      <div className={styles.form}>
        {success ? (
          <p className={styles.success} role="status">
            Visita solicitada. O anunciante será notificado.
          </p>
        ) : (
          <>
            <p className={styles.hint}>
              Escolha um horário na disponibilidade deste imóvel.
            </p>
            {slots.length === 0 ? (
              <p className={styles.empty}>Nenhum horário disponível nos próximos dias.</p>
            ) : (
              <ul className={styles.list} role="listbox" aria-label="Horários disponíveis">
                {slots.map((slot) => (
                  <li key={slot.id}>
                    <label className={styles.option}>
                      <input
                        type="radio"
                        name="visit-slot"
                        value={slot.id}
                        checked={selectedId === slot.id}
                        onChange={() => {
                          setSelectedId(slot.id)
                          setError('')
                        }}
                      />
                      <span>{slot.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}
          </>
        )}

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={close} disabled={book.isPending}>
            {success ? 'Fechar' : 'Cancelar'}
          </Button>
          {!success ? (
            <Button
              type="button"
              loading={book.isPending}
              disabled={slots.length === 0 || book.isPending}
              onClick={handleConfirm}
            >
              Confirmar visita
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
