import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthSplitLayout } from '../components/AuthSplitLayout/AuthSplitLayout'
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter/PasswordStrengthMeter'
import { Field, Input } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { scorePassword } from '../utils/passwordStrength'
import type { ListingIntent, UserRole } from '../types/auth'
import styles from './RegisterPage.module.css'

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'corretor', label: 'Corretor' },
  { value: 'corretora', label: 'Corretora' },
  { value: 'proprietario', label: 'Proprietário' },
]

const INTENTS: { value: ListingIntent; label: string }[] = [
  { value: 'sell', label: 'Vender' },
  { value: 'rent', label: 'Alugar' },
]

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

function validate(
  role: UserRole | null,
  intent: ListingIntent[],
  name: string,
  email: string,
  password: string,
) {
  const errors = { role: '', intent: '', name: '', email: '', password: '' }
  if (!role) errors.role = 'Selecione se você é corretor, corretora ou proprietário'
  if (intent.length === 0) errors.intent = 'Selecione se quer vender, alugar ou ambos'
  if (!name.trim()) errors.name = 'Nome é obrigatório'
  else if (name.trim().length < 2) errors.name = 'Nome muito curto'
  if (!email.trim()) errors.email = 'E-mail é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'E-mail inválido'
  if (!password) errors.password = 'Senha é obrigatória'
  else if (!scorePassword(password).canSubmit) errors.password = 'Senha fraca demais'
  return errors
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<UserRole | null>(null)
  const [intent, setIntent] = useState<ListingIntent[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ role: '', intent: '', name: '', email: '', password: '' })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleIntent(value: ListingIntent) {
    setIntent((prev) => (
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    ))
    setErrors((p) => ({ ...p, intent: '' }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    const errs = validate(role, intent, name, email, password)
    setErrors(errs)
    if (Object.values(errs).some(Boolean) || !role) return

    setIsSubmitting(true)
    try {
      await register({
        name: name.trim(),
        email,
        password,
        role,
        intent,
      })
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
    <AuthSplitLayout
      title="Anuncie em minutos, não em formulários."
      subtitle="Diga quem você é e o que precisa. Depois do pré-cadastro, o onboarding continua com você já dentro."
      footer="Corretores, corretoras e proprietários · Maringá e Sarandi"
    >
      <div className={styles.panel}>
        <h2 className={styles.heading}>Criar conta</h2>
        <p className={styles.subtitle}>Pré-cadastro rápido. Completamos o perfil depois.</p>

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
          <fieldset className={`${styles.choiceGroup} ${errors.role ? styles.choiceError : ''}`}>
            <legend>Você é</legend>
            <div role="radiogroup" aria-label="Você é" className={styles.chips}>
              {ROLES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={role === value}
                  className={`chip ${role === value ? 'active' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => {
                    setRole(value)
                    setErrors((p) => ({ ...p, role: '' }))
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.role ? <p className={styles.choiceHint} role="alert">{errors.role}</p> : null}
          </fieldset>

          <fieldset className={`${styles.choiceGroup} ${errors.intent ? styles.choiceError : ''}`}>
            <legend>Quer</legend>
            <div className={styles.chips}>
              {INTENTS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={intent.includes(value)}
                  className={`chip ${intent.includes(value) ? 'active' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => toggleIntent(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.intent ? <p className={styles.choiceHint} role="alert">{errors.intent}</p> : null}
          </fieldset>

          <Field label="Nome" htmlFor="reg-name" error={errors.name}>
            <Input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, name: validate(role, intent, name, email, password).name }))}
              placeholder="Como devemos te chamar"
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
              onBlur={() => setErrors((p) => ({ ...p, email: validate(role, intent, name, email, password).email }))}
              placeholder="seu@email.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </Field>

          <div>
            <Field label="Senha" htmlFor="reg-password" error={errors.password}>
              <Input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                onBlur={() => setErrors((p) => ({ ...p, password: validate(role, intent, name, email, password).password }))}
                placeholder="Crie uma senha"
                autoComplete="new-password"
                aria-describedby="reg-password-strength"
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
            <PasswordStrengthMeter id="reg-password-strength" password={password} />
          </div>

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
    </AuthSplitLayout>
  )
}
