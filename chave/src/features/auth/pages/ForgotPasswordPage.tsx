import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { apiForgotPassword } from '../services/authApi'
import { Field, Input } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import styles from './ForgotPasswordPage.module.css'

function validateEmail(value: string) {
  if (!value.trim()) return 'E-mail é obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido'
  return ''
}

function SuccessState({ email }: { email: string }) {
  return (
    <div className={styles.success} role="status" aria-live="polite">
      <div className={styles.successIcon} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.72-.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
      <h2 className={styles.successTitle}>E-mail enviado!</h2>
      <p className={styles.successText}>
        Enviamos as instruções de recuperação para{' '}
        <strong>{email}</strong>. Verifique sua caixa de entrada — pode levar
        alguns minutos.
      </p>
      <p className={styles.successHint}>
        Não recebeu?{' '}
        <button
          type="button"
          className={styles.resendBtn}
          onClick={() => window.location.reload()}
        >
          Reenviar e-mail
        </button>
      </p>
      <Link to="/entrar" className={styles.backLink}>
        ← Voltar para o login
      </Link>
    </div>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    const err = validateEmail(email)
    setEmailError(err)
    if (err) return

    setIsSubmitting(true)
    try {
      await apiForgotPassword(email)
      setSent(true)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Ocorreu um erro. Tente novamente.'
      setServerError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoMark} aria-hidden="true">C</div>
          <span className={styles.logoName}>Chave</span>
        </div>

        {sent ? (
          <SuccessState email={email} />
        ) : (
          <>
            <h1 className={styles.heading}>Esqueceu a senha?</h1>
            <p className={styles.subtitle}>
              Informe seu e-mail e enviaremos um link para redefinir a senha.
            </p>

            {serverError && (
              <div className={styles.serverError} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {serverError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Field label="E-mail" htmlFor="forgot-email" error={emailError}>
                <Input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  onBlur={() => setEmailError(validateEmail(email))}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </Field>

              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className={styles.submitBtn}
              >
                Enviar link de recuperação
              </Button>
            </form>

            <div className={styles.backRow}>
              <Link to="/entrar" className={styles.backLink}>
                ← Voltar para o login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
