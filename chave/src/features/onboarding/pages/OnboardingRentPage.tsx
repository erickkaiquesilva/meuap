import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { RentNearby, RentPurpose } from '@/features/auth/types/auth'
import { Field, Select } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { formatCurrencyBrl } from '@/shared/utils/brMasks'
import { OnboardingShell } from '../components/OnboardingShell/OnboardingShell'
import {
  delay,
  StepLoadingOverlay,
} from '../components/StepLoadingOverlay/StepLoadingOverlay'
import {
  RENT_BEDROOMS,
  RENT_CITIES,
  RENT_NEARBY,
  RENT_PURPOSES,
  RENT_SLIDER_MAX,
  RENT_SLIDER_MIN,
  RENT_SLIDER_STEP,
} from '../constants/rentProfile'
import styles from './OnboardingRentPage.module.css'

type Step = 1 | 2

export function OnboardingRentPage() {
  const { completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [purpose, setPurpose] = useState<RentPurpose | null>(null)
  const [nearby, setNearby] = useState<RentNearby[]>([])
  const [city, setCity] = useState<string>(RENT_CITIES[0])
  const [maxRent, setMaxRent] = useState<number | null>(2500)
  const [sliderValue, setSliderValue] = useState(2500)
  const [minBedrooms, setMinBedrooms] = useState<number | null>(2)
  const [condoIncluded, setCondoIncluded] = useState<boolean | null>(null)
  const [wantsParking, setWantsParking] = useState<boolean | null>(null)
  const [purposeError, setPurposeError] = useState('')
  const [prefsError, setPrefsError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionMsg, setTransitionMsg] = useState('')

  function toggleNearby(value: RentNearby) {
    setNearby((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  async function goToStep2() {
    if (!purpose) {
      setPurposeError('Selecione o motivo da busca')
      return
    }
    setPurposeError('')
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

  async function handleComplete(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    if (!purpose) {
      setStep(1)
      setPurposeError('Selecione o motivo da busca')
      return
    }
    if (!city) {
      setPrefsError('Selecione a cidade')
      return
    }
    if (minBedrooms === null) {
      setPrefsError('Selecione a quantidade de quartos')
      return
    }
    if (condoIncluded === null) {
      setPrefsError('Informe se deseja condomínio incluso')
      return
    }
    if (wantsParking === null) {
      setPrefsError('Informe se deseja vaga de garagem')
      return
    }

    setPrefsError('')
    setIsSubmitting(true)
    setTransitionMsg('Salvando seu perfil…')
    setTransitioning(true)
    try {
      await completeOnboarding({
        rentProfile: {
          purpose,
          city,
          maxRent,
          minBedrooms,
          nearby,
          condoIncluded,
          wantsParking,
        },
      })
      await delay(400)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Não foi possível salvar seu perfil. Tente novamente.'
      setServerError(message)
      setTransitioning(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <OnboardingShell
      title="Vamos achar o imóvel certo para você."
      subtitle="Algumas perguntas rápidas para personalizar a busca."
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
            <h2 className={styles.heading}>Para que você busca um imóvel?</h2>
            <p className={styles.subtitle}>Isso ajuda a Chave a entender o seu momento.</p>

            <fieldset className={`${styles.choiceGroup} ${purposeError ? styles.choiceError : ''}`}>
              <legend>Motivo da busca</legend>
              <div
                role="radiogroup"
                aria-label="Motivo da busca"
                className={styles.chips}
              >
                {RENT_PURPOSES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={purpose === value}
                    className={`chip ${purpose === value ? 'active' : ''}`}
                    onClick={() => {
                      setPurpose(value)
                      setPurposeError('')
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {purposeError ? (
                <p className={styles.choiceHint} role="alert">{purposeError}</p>
              ) : null}
            </fieldset>

            <fieldset className={styles.choiceGroup} style={{ marginTop: 24 }}>
              <legend>O que você deseja por perto?</legend>
              <p className={styles.subtitle} style={{ marginBottom: 12 }}>
                Marque o que importa no dia a dia — opcional.
              </p>
              <div className={styles.checkList} role="group" aria-label="Proximidades desejadas">
                {RENT_NEARBY.map(({ value, label }) => (
                  <label key={value} className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={nearby.includes(value)}
                      onChange={() => toggleNearby(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

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
            <h2 className={styles.heading}>Onde e quanto?</h2>
            <p className={styles.subtitle}>
              Preferências básicas — você pode mudar depois nos filtros.
            </p>

            <Field label="Cidade" htmlFor="rent-city" error={prefsError && !city ? prefsError : ''}>
              <Select
                id="rent-city"
                value={city}
                disabled={isSubmitting || transitioning}
                onChange={(e) => {
                  setCity(e.target.value)
                  setPrefsError('')
                }}
              >
                {RENT_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>

            <div className={styles.sliderBlock}>
              <span className={styles.sliderValue}>
                {maxRent === null ? 'Sem limite' : `Até ${formatCurrencyBrl(maxRent)}`}
              </span>
              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={maxRent === null}
                  disabled={isSubmitting || transitioning}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMaxRent(null)
                    } else {
                      setMaxRent(sliderValue)
                    }
                  }}
                />
                Sem limite de aluguel
              </label>
              <input
                id="rent-budget"
                className={styles.slider}
                type="range"
                min={RENT_SLIDER_MIN}
                max={RENT_SLIDER_MAX}
                step={RENT_SLIDER_STEP}
                value={sliderValue}
                disabled={maxRent === null || isSubmitting || transitioning}
                aria-label="Aluguel máximo"
                onChange={(e) => {
                  const next = Number(e.target.value)
                  setSliderValue(next)
                  setMaxRent(next)
                }}
              />
              <div className={styles.sliderMeta}>
                <span>{formatCurrencyBrl(RENT_SLIDER_MIN)}</span>
                <span>{formatCurrencyBrl(RENT_SLIDER_MAX)}</span>
              </div>
            </div>

            <fieldset className={`${styles.choiceGroup} ${prefsError && minBedrooms === null ? styles.choiceError : ''}`}>
              <legend>Quartos</legend>
              <div
                role="radiogroup"
                aria-label="Mínimo de quartos"
                className={styles.chips}
              >
                {RENT_BEDROOMS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={minBedrooms === value}
                    className={`chip ${minBedrooms === value ? 'active' : ''}`}
                    disabled={isSubmitting || transitioning}
                    onClick={() => {
                      setMinBedrooms(value)
                      setPrefsError('')
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={`${styles.choiceGroup} ${prefsError && condoIncluded === null ? styles.choiceError : ''}`}>
              <legend>Condomínio incluso no aluguel?</legend>
              <div role="radiogroup" aria-label="Condomínio incluso" className={styles.chips}>
                {[
                  { value: true, label: 'Sim, incluso' },
                  { value: false, label: 'Sem condomínio incluso' },
                ].map(({ value, label }) => (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={condoIncluded === value}
                    className={`chip ${condoIncluded === value ? 'active' : ''}`}
                    disabled={isSubmitting || transitioning}
                    onClick={() => {
                      setCondoIncluded(value)
                      setPrefsError('')
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={`${styles.choiceGroup} ${prefsError && wantsParking === null ? styles.choiceError : ''}`}>
              <legend>Deseja vaga de garagem?</legend>
              <div role="radiogroup" aria-label="Vaga de garagem" className={styles.chips}>
                {[
                  { value: true, label: 'Sim, com vaga' },
                  { value: false, label: 'Sem vaga' },
                ].map(({ value, label }) => (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={wantsParking === value}
                    className={`chip ${wantsParking === value ? 'active' : ''}`}
                    disabled={isSubmitting || transitioning}
                    onClick={() => {
                      setWantsParking(value)
                      setPrefsError('')
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {prefsError ? (
                <p className={styles.choiceHint} role="alert">{prefsError}</p>
              ) : null}
            </fieldset>

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
