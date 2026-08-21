import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { RentPurpose } from '@/features/auth/types/auth'
import { Field, Select } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { OnboardingShell } from '../components/OnboardingShell/OnboardingShell'
import {
  RENT_BEDROOMS,
  RENT_BUDGETS,
  RENT_CITIES,
  RENT_PURPOSES,
} from '../constants/rentProfile'
import styles from './OnboardingRentPage.module.css'

type Step = 1 | 2

export function OnboardingRentPage() {
  const { completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [purpose, setPurpose] = useState<RentPurpose | null>(null)
  const [city, setCity] = useState<string>(RENT_CITIES[0])
  const [maxRent, setMaxRent] = useState<number | null>(2500)
  const [minBedrooms, setMinBedrooms] = useState<number | null>(2)
  const [purposeError, setPurposeError] = useState('')
  const [prefsError, setPrefsError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function goToStep2() {
    if (!purpose) {
      setPurposeError('Selecione o motivo da busca')
      return
    }
    setPurposeError('')
    setStep(2)
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

    setPrefsError('')
    setIsSubmitting(true)
    try {
      await completeOnboarding({
        rentProfile: {
          purpose,
          city,
          maxRent,
          minBedrooms,
        },
      })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Não foi possível salvar seu perfil. Tente novamente.'
      setServerError(message)
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
        {serverError ? (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        ) : null}

        {step === 1 ? (
          <>
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

            <div className={styles.actions}>
              <Button type="button" onClick={goToStep2}>
                Continuar
              </Button>
            </div>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleComplete} noValidate>
            <p className={styles.steps}>Passo 2 de 2</p>
            <h2 className={styles.heading}>Onde e quanto?</h2>
            <p className={styles.subtitle}>
              Preferências básicas — você pode mudar depois nos filtros.
            </p>

            <Field label="Cidade" htmlFor="rent-city" error={prefsError && !city ? prefsError : ''}>
              <Select
                id="rent-city"
                value={city}
                disabled={isSubmitting}
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

            <Field label="Aluguel até (R$)" htmlFor="rent-budget">
              <Select
                id="rent-budget"
                value={maxRent === null ? 'null' : String(maxRent)}
                disabled={isSubmitting}
                onChange={(e) => {
                  const v = e.target.value
                  setMaxRent(v === 'null' ? null : Number(v))
                }}
              >
                {RENT_BUDGETS.map(({ value, label }) => (
                  <option key={label} value={value === null ? 'null' : String(value)}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>

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
                    disabled={isSubmitting}
                    onClick={() => {
                      setMinBedrooms(value)
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
              <Button type="submit" loading={isSubmitting}>
                Concluir
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep(1)}
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
