import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthSplitLayout } from '../components/AuthSplitLayout/AuthSplitLayout'
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter/PasswordStrengthMeter'
import { Field, Input } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { scorePassword } from '../utils/passwordStrength'
import type { UserGoal } from '../types/auth'
import styles from './RegisterPage.module.css'

const GOALS: { value: UserGoal; label: string }[] = [
  { value: 'rent', label: 'Alugar um imóvel' },
  { value: 'list', label: 'Anunciar um imóvel' },
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
  goal: UserGoal | null,
  name: string,
  email: string,
  password: string,
  confirm: string,
  acceptedTerms: boolean,
) {
  const errors = { goal: '', name: '', email: '', password: '', confirm: '', terms: '' }
  if (!goal) errors.goal = 'Selecione se quer alugar ou anunciar um imóvel'
  if (!name.trim()) errors.name = 'Nome é obrigatório'
  else if (name.trim().length < 2) errors.name = 'Nome muito curto'
  if (!email.trim()) errors.email = 'E-mail é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'E-mail inválido'
  if (!password) errors.password = 'Senha é obrigatória'
  else if (!scorePassword(password).canSubmit) errors.password = 'Senha fraca demais'
  if (!confirm) errors.confirm = 'Confirme a senha'
  else if (confirm !== password) errors.confirm = 'As senhas não coincidem'
  if (!acceptedTerms) errors.terms = 'Aceite os Termos de uso e a Política de privacidade'
  return errors
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [goal, setGoal] = useState<UserGoal | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({
    goal: '',
    name: '',
    email: '',
    password: '',
    confirm: '',
    terms: '',
  })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    const errs = validate(goal, name, email, password, confirm, acceptedTerms)
    setErrors(errs)
    if (Object.values(errs).some(Boolean) || !goal) return

    setIsSubmitting(true)
    try {
      await register({
        name: name.trim(),
        email,
        password,
        goal,
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
      title="Seu próximo passo começa aqui."
      subtitle="Diga se quer alugar ou anunciar. Depois do pré-cadastro, o onboarding continua com você já dentro."
      footer="Maringá e Sarandi"
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
          <fieldset className={`${styles.choiceGroup} ${errors.goal ? styles.choiceError : ''}`}>
            <legend>O que você está procurando com a Chave?</legend>
            <div role="radiogroup" aria-label="O que você está procurando com a Chave?" className={styles.chips}>
              {GOALS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={goal === value}
                  className={`chip ${goal === value ? 'active' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => {
                    setGoal(value)
                    setErrors((p) => ({ ...p, goal: '' }))
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.goal ? <p className={styles.choiceHint} role="alert">{errors.goal}</p> : null}
          </fieldset>

          <Field label="Qual o seu nome?" htmlFor="reg-name" error={errors.name}>
            <Input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, name: validate(goal, name, email, password, confirm, acceptedTerms).name }))}
              placeholder="Como devemos te chamar"
              autoComplete="name"
              disabled={isSubmitting}
            />
          </Field>

          <Field label="Qual o seu e-mail?" htmlFor="reg-email" error={errors.email}>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, email: validate(goal, name, email, password, confirm, acceptedTerms).email }))}
              placeholder="seu@email.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </Field>

          <div>
            <Field label="Digite uma senha" htmlFor="reg-password" error={errors.password}>
              <Input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '', confirm: '' })) }}
                onBlur={() => setErrors((p) => ({ ...p, password: validate(goal, name, email, password, confirm, acceptedTerms).password }))}
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

          <Field label="Confirme a senha" htmlFor="reg-confirm" error={errors.confirm}>
            <Input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })) }}
              onBlur={() => setErrors((p) => ({ ...p, confirm: validate(goal, name, email, password, confirm, acceptedTerms).confirm }))}
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

          <div className={`${styles.termsRow} ${errors.terms ? styles.termsError : ''}`}>
            <label className={styles.termsLabel} htmlFor="reg-terms">
              <input
                id="reg-terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked)
                  setErrors((p) => ({ ...p, terms: '' }))
                }}
                disabled={isSubmitting}
              />
              <span>
                Aceito os{' '}
                <Link to="/termos">Termos de uso</Link>
                {' '}e a{' '}
                <Link to="/privacidade">Política de privacidade</Link>
                {' '}da plataforma
              </span>
            </label>
            {errors.terms ? <p className={styles.choiceHint} role="alert">{errors.terms}</p> : null}
          </div>

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
