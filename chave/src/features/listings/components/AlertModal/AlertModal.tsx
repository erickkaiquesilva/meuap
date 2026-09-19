import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { getApiErrorMessage } from '@/core/api/errors'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import type { SearchFilters } from '@/shared/types/property'
import {
  summarizeAlertFilters,
  toAlertFilters,
  type AlertChannel,
} from '../../api/alertsTypes'
import { useCreateAlert } from '../../hooks/useAlerts'
import styles from './AlertModal.module.css'

const CHANNEL_OPTIONS: { value: AlertChannel; label: string }[] = [
  { value: 'email', label: 'E-mail' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'push', label: 'Push (quando disponível)' },
]

interface AlertModalProps {
  open: boolean
  filters: SearchFilters
  onClose: () => void
}

export function AlertModal({ open, filters, onClose }: AlertModalProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const create = useCreateAlert()
  const [channels, setChannels] = useState<AlertChannel[]>(['email'])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const alertFilters = toAlertFilters(filters)
  const summary = summarizeAlertFilters(alertFilters)

  const close = useCallback(() => {
    setChannels(['email'])
    setError('')
    setSuccess(false)
    onClose()
  }, [onClose])

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

  function toggleChannel(channel: AlertChannel) {
    setChannels((prev) => {
      if (prev.includes(channel)) {
        if (prev.length === 1) return prev
        return prev.filter((c) => c !== channel)
      }
      return [...prev, channel]
    })
  }

  function handleSubmit() {
    if (!ensureAuth()) return
    if (channels.length === 0) {
      setError('Selecione ao menos um canal')
      return
    }
    setError('')
    create.mutate(
      { filters: alertFilters, channels },
      {
        onSuccess: () => {
          setSuccess(true)
        },
        onError: (err: unknown) => {
          setError(getApiErrorMessage(err, 'Não foi possível criar o alerta.'))
        },
      },
    )
  }

  return (
    <Modal title="Criar alerta de busca" onClose={close}>
      {success ? (
        <div className={styles.form}>
          <p className={styles.success} role="status">
            Alerta criado. Avisaremos quando um imóvel novo bater com esses filtros.
          </p>
          <div className={styles.actions}>
            <Button type="button" onClick={close}>
              Fechar
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.form}>
          <p className={styles.hint}>
            Critérios: <strong>{summary}</strong>
          </p>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Canais de notificação</legend>
            {CHANNEL_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.option}>
                <input
                  type="checkbox"
                  checked={channels.includes(opt.value)}
                  onChange={() => toggleChannel(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </fieldset>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={create.isPending || isLoading}
            >
              {create.isPending ? 'Salvando…' : 'Criar alerta'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
