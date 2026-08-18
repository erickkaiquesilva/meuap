import { useState } from 'react'
import { googleClientId } from '@/core/api/config'
import { GoogleIcon } from './GoogleIcon'
import { requestGoogleCredential } from '../../utils/googleIdentity'
import styles from './GoogleLoginButton.module.css'

interface GoogleLoginButtonProps {
  disabled?: boolean
  onError: (message: string) => void
  onSuccess: (idToken?: string) => Promise<void>
}

export function GoogleLoginButton({ disabled, onError, onSuccess }: GoogleLoginButtonProps) {
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (disabled || busy) return
    setBusy(true)
    try {
      if (googleClientId) {
        const idToken = await requestGoogleCredential(googleClientId)
        await onSuccess(idToken)
      } else {
        await onSuccess()
      }
    } catch {
      onError('Não foi possível entrar com a Conta Google. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={disabled || busy}
      aria-busy={busy}
    >
      <GoogleIcon />
      {busy ? 'Entrando…' : 'Entrar com Conta Google'}
    </button>
  )
}
