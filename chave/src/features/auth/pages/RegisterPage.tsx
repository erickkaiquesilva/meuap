import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Field, Input } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import styles from './RegisterPage.module.css'

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

function validate(name: string, email: string, password: string, confirm: string) {
  const errors = { name: '', email: '', password: '', confirm: '' }
  if (!name.trim()) errors.name = 'Nome é obrigatório'
  else if (name.trim().length < 2) errors.name = 'Nome muito curto'
  if (!email.trim()) errors.email = 'E-mail é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'E-mail inválido'
  if (!password) errors.password = 'Senha é obrigatória'
  else if (password.length < 6) errors.password = 'Mínimo 6 caracteres'
  if (!confirm) errors.confirm = 'Confirme a senha'
  else if (confirm !== password) errors.confirm = 'As senhas não coincidem'
  return errors
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirm: '' })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    const errs = validate(name, email, password, confirm)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return

    setIsSubmitting(true)
    try {
      await register(name.trim(), email, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao criar conta. Tente novamente.'
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

        <h1 className={styles.heading}>Crie sua conta</h1>
        <p className={styles.subtitle}>Cadastre-se gratuitamente e encontre seu próximo imóvel</p>

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
          <Field label="Nome completo" htmlFor="reg-name" error={errors.name}>
            <Input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, name: validate(name, email, password, confirm).name }))}
              placeholder="Seu nome completo"
              autoComplete="name"
              disabled={isSubmitting}
            />
          </Field>

          <Field label="E-mail" htmlFor="reg-email" error={errors.email}>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, email: validate(name, email, password, confirm).email }))}
              placeholder="seu@email.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </Field>

          <Field label="Senha" htmlFor="reg-password" error={errors.password}>
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, password: validate(name, email, password, confirm).password }))}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.eyeToggle}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShowPassword((v) => !v)}
            >
              <EyeIcon open={showPassword} />
            </button>
          </Field>

          <Field label="Confirmar senha" htmlFor="reg-confirm" error={errors.confirm}>
            <Input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, confirm: validate(name, email, password, confirm).confirm }))}
              placeholder="Repita a senha"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.eyeToggle}
              aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
              onClick={() => setShowConfirm((v) => !v)}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </Field>

          <p className={styles.terms}>
            Ao criar uma conta, você concorda com os{' '}
            <Link to="/termos">Termos de uso</Link> e a{' '}
            <Link to="/privacidade">Política de privacidade</Link>.
          </p>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className={styles.submitBtn}
          >
            Criar conta
          </Button>
        </form>

        <div className={styles.divider}>ou</div>

        <p className={styles.loginLink}>
          Já tem uma conta?{' '}
          <Link to="/entrar">Entrar</Link>
        </p>
      </div>
    </main>
  )
}
