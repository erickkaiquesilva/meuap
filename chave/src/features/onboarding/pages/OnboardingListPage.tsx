import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { ListProfile, UserRole } from '@/features/auth/types/auth'
import { Field, Input, Select } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { digitsOnly } from '@/shared/utils/brDocuments'
import { maskCnpj, maskCpf, maskPhone } from '@/shared/utils/brMasks'
import { OnboardingShell } from '../components/OnboardingShell/OnboardingShell'
import {
  delay,
  StepLoadingOverlay,
} from '../components/StepLoadingOverlay/StepLoadingOverlay'
import {
  LIST_CITIES,
  LIST_PERSONAS,
  isValidCnpj,
  isValidCpf,
  isValidOptionalUrl,
  isValidPhone,
} from '../constants/listPersona'
import styles from './OnboardingListPage.module.css'

type Step = 1 | 2

type FormErrors = Record<string, string>

function step2Title(role: UserRole): string {
  if (role === 'proprietario') return 'Dados do proprietário'
  if (role === 'corretor') return 'Dados do corretor'
  return 'Dados da corretora'
}

export function OnboardingListPage() {
  const { completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<UserRole | null>(null)
  const [roleError, setRoleError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionMsg, setTransitionMsg] = useState('')

  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState<string>(LIST_CITIES[0])
  const [hasListingReady, setHasListingReady] = useState<boolean | null>(null)
  const [creci, setCreci] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [creciJ, setCreciJ] = useState('')
  const [cities, setCities] = useState<string[]>([LIST_CITIES[0]])
  const [website, setWebsite] = useState('')

  async function goToStep2() {
    if (!role) {
      setRoleError('Selecione como você anuncia')
      return
    }
    setRoleError('')
    setErrors({})
    setTransitionMsg('Preparando o próximo passo…')
    setTransitioning(true)
    await delay(650)
    setStep(2)
    setTransitioning(false)
  }

  async function goToStep1() {
    setTransitionMsg('Voltando…')
    setTransitioning(true)
    await delay(450)
    setStep(1)
    setTransitioning(false)
  }

  function toggleCity(value: string) {
    setCities((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    )
    setErrors((p) => ({ ...p, cities: '' }))
  }

  function validateAndBuildProfile(selected: UserRole): { profile?: ListProfile; errors: FormErrors } {
    const next: FormErrors = {}

    if (selected === 'proprietario') {
      if (!isValidCpf(cpf)) next.cpf = 'CPF inválido'
      if (!isValidPhone(phone)) next.phone = 'Informe um telefone válido com DDD'
      if (!city) next.city = 'Selecione a cidade'
      if (hasListingReady === null) next.hasListingReady = 'Informe se já tem imóvel para anunciar'
      if (Object.keys(next).length) return { errors: next }
      return {
        errors: next,
        profile: {
          kind: 'proprietario',
          cpf: digitsOnly(cpf),
          phone: digitsOnly(phone),
          city,
          hasListingReady: hasListingReady!,
        },
      }
    }

    if (selected === 'corretor') {
      if (!isValidCpf(cpf)) next.cpf = 'CPF inválido'
      if (!creci.trim()) next.creci = 'CRECI é obrigatório'
      if (!isValidPhone(phone)) next.phone = 'Informe um telefone válido com DDD'
      if (!city) next.city = 'Selecione a cidade'
      if (Object.keys(next).length) return { errors: next }
      return {
        errors: next,
        profile: {
          kind: 'corretor',
          cpf: digitsOnly(cpf),
          creci: creci.trim(),
          phone: digitsOnly(phone),
          city,
        },
      }
    }

    if (!tradeName.trim()) next.tradeName = 'Nome fantasia é obrigatório'
    if (!isValidCnpj(cnpj)) next.cnpj = 'CNPJ inválido'
    if (!isValidPhone(phone)) next.phone = 'Informe um telefone comercial válido com DDD'
    if (cities.length === 0) next.cities = 'Selecione ao menos uma cidade'
    if (!isValidOptionalUrl(website)) next.website = 'URL inválida'
    if (Object.keys(next).length) return { errors: next }

    return {
      errors: next,
      profile: {
        kind: 'corretora',
        tradeName: tradeName.trim(),
        legalName: legalName.trim(),
        cnpj: digitsOnly(cnpj),
        creciJ: creciJ.trim(),
        phone: digitsOnly(phone),
        cities,
        website: website.trim(),
      },
    }
  }

  async function handleComplete(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    if (!role) {
      setStep(1)
      setRoleError('Selecione como você anuncia')
      return
    }

    const { profile, errors: nextErrors } = validateAndBuildProfile(role)
    setErrors(nextErrors)
    if (!profile) return

    setIsSubmitting(true)
    setTransitionMsg('Salvando seus dados…')
    setTransitioning(true)
    try {
      await completeOnboarding({ role, listProfile: profile })
      await delay(400)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Não foi possível salvar seus dados. Tente novamente.'
      setServerError(message)
      setTransitioning(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <OnboardingShell
      title="Vamos conhecer você antes de anunciar."
      subtitle="Diga se é dono, corretor ou corretora — coletamos só o essencial agora."
    >
      <div className={styles.panel}>
        {transitioning ? <StepLoadingOverlay message={transitionMsg} /> : null}

        {serverError ? (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        ) : null}

        {step === 1 ? (
          <div key="step-1" className={styles.stepEnter}>
            <p className={styles.steps}>Passo 1 de 2</p>
            <h2 className={styles.heading}>Você está anunciando como?</h2>
            <p className={styles.subtitle}>
              Escolha a opção que melhor descreve você. Coletamos só o essencial agora.
            </p>

            <div
              role="radiogroup"
              aria-label="Tipo de anunciante"
              className={styles.personaList}
            >
              {LIST_PERSONAS.map(({ value, label, hint }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={role === value}
                  className={`${styles.personaOption} ${role === value ? styles.personaOptionActive : ''}`}
                  onClick={() => {
                    setRole(value)
                    setRoleError('')
                  }}
                >
                  {label}
                  <small className={styles.personaHint}>{hint}</small>
                </button>
              ))}
            </div>
            {roleError ? (
              <p className={styles.choiceHint} role="alert">{roleError}</p>
            ) : null}

            <div className={styles.actions}>
              <Button type="button" onClick={goToStep2} disabled={transitioning}>
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <form
            key="step-2"
            className={`${styles.form} ${styles.stepEnter}`}
            onSubmit={handleComplete}
            noValidate
          >
            <p className={styles.steps}>Passo 2 de 2</p>
            <h2 className={styles.heading}>{step2Title(role!)}</h2>
            <p className={styles.subtitle}>
              Dashboard de anúncios fica para depois — só o perfil agora.
            </p>

            {role === 'proprietario' ? (
              <>
                <Field label="CPF" htmlFor="list-cpf" error={errors.cpf}>
                  <Input
                    id="list-cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={cpf}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setCpf(maskCpf(e.target.value))
                      setErrors((p) => ({ ...p, cpf: '' }))
                    }}
                  />
                </Field>
                <Field label="Telefone / WhatsApp" htmlFor="list-phone" error={errors.phone}>
                  <Input
                    id="list-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(44) 99999-9999"
                    value={phone}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setPhone(maskPhone(e.target.value))
                      setErrors((p) => ({ ...p, phone: '' }))
                    }}
                  />
                </Field>
                <Field label="Cidade do(s) imóvel(is)" htmlFor="list-city" error={errors.city}>
                  <Select
                    id="list-city"
                    value={city}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setCity(e.target.value)
                      setErrors((p) => ({ ...p, city: '' }))
                    }}
                  >
                    {LIST_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
                <fieldset className={`${styles.choiceGroup} ${errors.hasListingReady ? styles.choiceError : ''}`}>
                  <legend>Já tem imóvel para anunciar agora?</legend>
                  <div role="radiogroup" aria-label="Já tem imóvel para anunciar agora?" className={styles.chips}>
                    {[
                      { value: true, label: 'Sim' },
                      { value: false, label: 'Ainda não' },
                    ].map(({ value, label }) => (
                      <button
                        key={label}
                        type="button"
                        role="radio"
                        aria-checked={hasListingReady === value}
                        className={`chip ${hasListingReady === value ? 'active' : ''}`}
                        disabled={isSubmitting || transitioning}
                        onClick={() => {
                          setHasListingReady(value)
                          setErrors((p) => ({ ...p, hasListingReady: '' }))
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.hasListingReady ? (
                    <p className={styles.choiceHint} role="alert">{errors.hasListingReady}</p>
                  ) : null}
                </fieldset>
              </>
            ) : null}

            {role === 'corretor' ? (
              <>
                <Field label="CPF" htmlFor="list-cpf-corretor" error={errors.cpf}>
                  <Input
                    id="list-cpf-corretor"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={cpf}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setCpf(maskCpf(e.target.value))
                      setErrors((p) => ({ ...p, cpf: '' }))
                    }}
                  />
                </Field>
                <Field label="CRECI (PF)" htmlFor="list-creci" error={errors.creci}>
                  <Input
                    id="list-creci"
                    type="text"
                    placeholder="CRECI-PR 12345"
                    value={creci}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setCreci(e.target.value)
                      setErrors((p) => ({ ...p, creci: '' }))
                    }}
                  />
                </Field>
                <Field label="Telefone / WhatsApp" htmlFor="list-phone-corretor" error={errors.phone}>
                  <Input
                    id="list-phone-corretor"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(44) 99999-9999"
                    value={phone}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setPhone(maskPhone(e.target.value))
                      setErrors((p) => ({ ...p, phone: '' }))
                    }}
                  />
                </Field>
                <Field label="Cidade principal de atuação" htmlFor="list-city-corretor" error={errors.city}>
                  <Select
                    id="list-city-corretor"
                    value={city}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setCity(e.target.value)
                      setErrors((p) => ({ ...p, city: '' }))
                    }}
                  >
                    {LIST_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
              </>
            ) : null}

            {role === 'corretora' ? (
              <>
                <Field label="Nome fantasia" htmlFor="list-trade" error={errors.tradeName}>
                  <Input
                    id="list-trade"
                    type="text"
                    placeholder="Imobiliária Exemplo"
                    value={tradeName}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setTradeName(e.target.value)
                      setErrors((p) => ({ ...p, tradeName: '' }))
                    }}
                  />
                </Field>
                <Field label="Razão social (opcional)" htmlFor="list-legal">
                  <Input
                    id="list-legal"
                    type="text"
                    value={legalName}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => setLegalName(e.target.value)}
                  />
                </Field>
                <Field label="CNPJ" htmlFor="list-cnpj" error={errors.cnpj}>
                  <Input
                    id="list-cnpj"
                    type="text"
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setCnpj(maskCnpj(e.target.value))
                      setErrors((p) => ({ ...p, cnpj: '' }))
                    }}
                  />
                </Field>
                <Field label="CRECI da empresa (se houver)" htmlFor="list-crecij">
                  <Input
                    id="list-crecij"
                    type="text"
                    placeholder="CRECI-J"
                    value={creciJ}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => setCreciJ(e.target.value)}
                  />
                </Field>
                <Field label="Telefone comercial" htmlFor="list-phone-corp" error={errors.phone}>
                  <Input
                    id="list-phone-corp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(44) 99999-9999"
                    value={phone}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setPhone(maskPhone(e.target.value))
                      setErrors((p) => ({ ...p, phone: '' }))
                    }}
                  />
                </Field>
                <fieldset className={`${styles.choiceGroup} ${errors.cities ? styles.choiceError : ''}`}>
                  <legend>Cidade(s) de atuação</legend>
                  <div role="group" aria-label="Cidades de atuação" className={styles.chips}>
                    {LIST_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={cities.includes(c)}
                        className={`chip ${cities.includes(c) ? 'active' : ''}`}
                        disabled={isSubmitting || transitioning}
                        onClick={() => toggleCity(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.cities ? (
                    <p className={styles.choiceHint} role="alert">{errors.cities}</p>
                  ) : null}
                </fieldset>
                <Field label="Site (opcional)" htmlFor="list-site" error={errors.website}>
                  <Input
                    id="list-site"
                    type="url"
                    placeholder="https://"
                    value={website}
                    disabled={isSubmitting || transitioning}
                    onChange={(e) => {
                      setWebsite(e.target.value)
                      setErrors((p) => ({ ...p, website: '' }))
                    }}
                  />
                </Field>
              </>
            ) : null}

            <p className={styles.note}>
              Validamos CPF, CNPJ e telefone no cliente — sem consulta a órgãos.
            </p>

            <div className={styles.actions}>
              <Button type="submit" loading={isSubmitting} disabled={transitioning}>
                Concluir
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || transitioning}
                onClick={goToStep1}
              >
                Voltar
              </Button>
            </div>
          </form>
        )}
      </div>
    </OnboardingShell>
  )
}
