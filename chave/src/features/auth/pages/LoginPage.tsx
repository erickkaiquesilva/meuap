import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthSplitLayout } from '../components/AuthSplitLayout/AuthSplitLayout'
import { GoogleLoginButton } from '../components/GoogleLoginButton/GoogleLoginButton'
import { Field, Input } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { needsOnboarding, onboardingPathForGoal } from '../utils/onboarding'
import type { User } from '../types/auth'
import styles from './LoginPage.module.css'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function validateEmail(value: string) {
  if (!value.trim()) return 'E-mail é obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido'
  return ''
}

function validatePassword(value: string) {
  if (!value) return 'Senha é obrigatória'
  if (value.length < 6) return 'A senha deve ter pelo menos 6 caracteres'
  return ''
}

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function redirectAfterLogin(me: User) {
    if (needsOnboarding(me) && me.goal) {
      navigate(onboardingPathForGoal(me.goal), { replace: true })
      return
    }
    const redirect = searchParams.get('redirect') ?? '/'
    navigate(redirect, { replace: true })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)
    if (eErr || pErr) return

    setIsSubmitting(true)
    try {
      const me = await login(email, password)
      redirectAfterLogin(me)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Ocorreu um erro. Tente novamente.'
      setServerError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthSplitLayout
      title="Seu próximo lar começa aqui"
      subtitle="Entre para salvar favoritos e acompanhar suas negociações."
      footer="Maringá e Sarandi"
    >
      <div className={styles.panel}>
        <h2 className={styles.heading}>Bem-vindo de volta</h2>
        <p className={styles.subtitle}>Entre com seu e-mail e senha para continuar</p>

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
          <Field
            label="E-mail"
            htmlFor="login-email"
            error={emailError}
          >
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              onBlur={() => setEmailError(validateEmail(email))}
              placeholder="seu@email.com"
              autoComplete="email"
              aria-describedby={emailError ? 'login-email-err' : undefined}
              disabled={isSubmitting}
            />
          </Field>

          <div className={styles.passwordFieldGroup}>
            <Field
              label="Senha"
              htmlFor="login-password"
              error={passwordError}
            >
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                onBlur={() => setPasswordError(validatePassword(password))}
                placeholder="Mínimo 6 caracteres"
                autoComplete="current-password"
                aria-describedby={passwordError ? 'login-password-err' : undefined}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </Field>

            <div className={styles.forgotRow}>
              <Link to="/recuperar-senha" className={styles.forgotLink}>Esqueceu a senha?</Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className={styles.submitBtn}
          >
            Entrar
          </Button>
        </form>

        <div className={styles.divider}>ou</div>

        <GoogleLoginButton
          disabled={isSubmitting}
          onError={setServerError}
          onSuccess={async (idToken) => {
            setServerError('')
            const me = await loginWithGoogle(idToken)
            redirectAfterLogin(me)
          }}
        />

        <p className={styles.registerLink}>
          Não tem uma conta?{' '}
          <Link to="/cadastro">Cadastre-se gratuitamente</Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
