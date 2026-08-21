import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Field, Input, Select } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import { digitsOnly } from '@/shared/utils/brDocuments'
import { formatCurrencyBrl, maskCep } from '@/shared/utils/brMasks'
import type { CreateListingInput } from '../types/listings'
import { useCreateMyListing } from '../hooks/useMyListings'
import { lookupCep } from '../services/cepLookup'
import {
  LISTING_AMENITIES,
  LISTING_OPERATIONS,
  LISTING_TYPES,
  MAX_LISTING_PHOTOS,
  MAX_PHOTO_BYTES,
  RENT_PRICE_DEFAULT,
  RENT_PRICE_MAX,
  RENT_PRICE_MIN,
  RENT_PRICE_STEP,
  SALE_PRICE_DEFAULT,
  SALE_PRICE_MAX,
  SALE_PRICE_MIN,
  SALE_PRICE_STEP,
} from '../constants/listingForm'
import styles from './NewListingPage.module.css'

type FormErrors = Partial<
  Record<
    keyof CreateListingInput | 'form' | 'cep' | 'street' | 'number' | 'state' | 'photos',
    string
  >
>

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function priceConfig(operation: CreateListingInput['operation']) {
  if (operation === 'sale') {
    return {
      min: SALE_PRICE_MIN,
      max: SALE_PRICE_MAX,
      step: SALE_PRICE_STEP,
      defaultValue: SALE_PRICE_DEFAULT,
    }
  }
  return {
    min: RENT_PRICE_MIN,
    max: RENT_PRICE_MAX,
    step: RENT_PRICE_STEP,
    defaultValue: RENT_PRICE_DEFAULT,
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

interface StepperProps {
  id: string
  label: string
  value: number
  min?: number
  max?: number
  disabled?: boolean
  onChange: (next: number) => void
}

function Stepper({ id, label, value, min = 0, max = 20, disabled, onChange }: StepperProps) {
  return (
    <div className={styles.stepper}>
      <span className={styles.stepperLabel} id={`${id}-label`}>{label}</span>
      <div className={styles.stepperControls} role="group" aria-labelledby={`${id}-label`}>
        <button
          type="button"
          className={styles.stepperBtn}
          aria-label={`Diminuir ${label.toLowerCase()}`}
          disabled={disabled || value <= min}
          onClick={() => onChange(clamp(value - 1, min, max))}
        >
          −
        </button>
        <span className={styles.stepperValue} aria-live="polite">{value}</span>
        <button
          type="button"
          className={styles.stepperBtn}
          aria-label={`Aumentar ${label.toLowerCase()}`}
          disabled={disabled || value >= max}
          onClick={() => onChange(clamp(value + 1, min, max))}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function NewListingPage() {
  const navigate = useNavigate()
  const createMutation = useCreateMyListing()
  const photoInputId = useId()
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [type, setType] = useState<CreateListingInput['type']>('apartment')
  const [operation, setOperation] = useState<CreateListingInput['operation']>('rent')
  const [price, setPrice] = useState(RENT_PRICE_DEFAULT)
  const [cep, setCep] = useState('')
  const [cepLoading, setCepLoading] = useState(false)
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(1)
  const [parkingSpots, setParkingSpots] = useState(1)
  const [area, setArea] = useState('60')
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')

  const cfg = priceConfig(operation)

  useEffect(() => {
    setPrice((prev) => {
      if (prev < cfg.min || prev > cfg.max) return cfg.defaultValue
      const snapped = Math.round(prev / cfg.step) * cfg.step
      return clamp(snapped, cfg.min, cfg.max)
    })
  }, [cfg.defaultValue, cfg.max, cfg.min, cfg.step, operation])

  function toggleAmenity(value: string) {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  async function handleCepBlur() {
    const digits = digitsOnly(cep)
    if (digits.length !== 8) return

    setCepLoading(true)
    setErrors((p) => ({ ...p, cep: undefined }))
    try {
      const found = await lookupCep(digits)
      if (!found) {
        setErrors((p) => ({ ...p, cep: 'CEP não encontrado' }))
        return
      }
      setStreet(found.street)
      setNeighborhood(found.neighborhood)
      setCity(found.city)
      setState(found.state)
      setErrors((p) => ({
        ...p,
        cep: undefined,
        street: undefined,
        neighborhood: undefined,
        city: undefined,
        state: undefined,
      }))
    } catch {
      setErrors((p) => ({ ...p, cep: 'Não foi possível consultar o CEP' }))
    } finally {
      setCepLoading(false)
    }
  }

  async function handlePhotosSelected(fileList: FileList | null) {
    if (!fileList?.length) return
    const remaining = MAX_LISTING_PHOTOS - photos.length
    if (remaining <= 0) {
      setErrors((p) => ({ ...p, photos: `Máximo de ${MAX_LISTING_PHOTOS} fotos` }))
      return
    }

    const files = Array.from(fileList).slice(0, remaining)
    const nextUrls: string[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setErrors((p) => ({ ...p, photos: 'Envie apenas imagens' }))
        continue
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setErrors((p) => ({ ...p, photos: 'Cada foto deve ter no máximo 2 MB' }))
        continue
      }
      nextUrls.push(await readFileAsDataUrl(file))
    }
    if (nextUrls.length) {
      setPhotos((prev) => [...prev, ...nextUrls].slice(0, MAX_LISTING_PHOTOS))
      setErrors((p) => ({ ...p, photos: undefined }))
    }
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!title.trim() || title.trim().length < 8) {
      next.title = 'Título com pelo menos 8 caracteres'
    }
    if (!Number.isFinite(price) || price <= 0) {
      next.price = 'Informe um preço válido'
    }
    if (digitsOnly(cep).length !== 8) {
      next.cep = 'Informe um CEP válido'
    }
    if (!street.trim() || street.trim().length < 3) {
      next.street = 'Informe a rua'
    }
    if (!number.trim()) {
      next.number = 'Informe o número'
    }
    if (!neighborhood.trim()) next.neighborhood = 'Informe o bairro'
    if (!city.trim()) next.city = 'Informe a cidade'
    if (!state.trim() || state.trim().length !== 2) {
      next.state = 'Informe o estado (UF)'
    }
    if (bedrooms < 0) next.bedrooms = 'Quartos inválidos'
    if (bathrooms < 0) next.bathrooms = 'Banheiros inválidos'
    if (parkingSpots < 0) next.parkingSpots = 'Vagas inválidas'
    const areaNum = Number(area)
    if (!Number.isFinite(areaNum) || areaNum <= 0) {
      next.area = 'Área deve ser maior que zero'
    }
    if (!description.trim() || description.trim().length < 20) {
      next.description = 'Descrição com pelo menos 20 caracteres'
    }
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const address = `${street.trim()}, ${number.trim()}`
    const payload: CreateListingInput = {
      title: title.trim(),
      type,
      operation,
      price,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      address,
      bedrooms,
      bathrooms,
      parkingSpots,
      area: Number(area),
      description: description.trim(),
      amenities,
      photos: photos.length ? photos : undefined,
    }

    try {
      await createMutation.mutateAsync(payload)
      navigate('/anuncios', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Não foi possível publicar o anúncio. Tente novamente.'
      setServerError(message)
    }
  }

  const busy = createMutation.isPending || cepLoading
  const priceLabel = operation === 'rent' ? 'Aluguel mensal' : 'Preço de venda'

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Novo anúncio</h1>
          <p className={styles.sub}>
            Preencha os dados do imóvel. Você poderá gerenciar depois em Meus anúncios.
          </p>
        </div>
        <Link to="/anuncios" className={`btn btn-outline btn-sm ${styles.cancelBtn}`}>
          Cancelar
        </Link>
      </header>

      {serverError ? (
        <div className={styles.serverError} role="alert">{serverError}</div>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <section className={styles.section} aria-labelledby="basics-title">
          <h2 id="basics-title" className={styles.sectionTitle}>Dados principais</h2>

          <Field label="Título do anúncio" htmlFor="listing-title" error={errors.title}>
            <Input
              id="listing-title"
              value={title}
              placeholder="Ex.: Apartamento 2 quartos na Zona 7"
              disabled={busy}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrors((p) => ({ ...p, title: undefined }))
              }}
            />
          </Field>

          <div className={styles.row}>
            <Field label="Tipo" htmlFor="listing-type">
              <Select
                id="listing-type"
                value={type}
                disabled={busy}
                onChange={(e) => setType(e.target.value as CreateListingInput['type'])}
              >
                {LISTING_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Operação" htmlFor="listing-op">
              <Select
                id="listing-op"
                value={operation}
                disabled={busy}
                onChange={(e) => {
                  const nextOp = e.target.value as CreateListingInput['operation']
                  setOperation(nextOp)
                  setPrice(priceConfig(nextOp).defaultValue)
                }}
              >
                {LISTING_OPERATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className={styles.sliderBlock}>
            <span className={styles.sliderLabel}>{priceLabel}</span>
            <p
              id="listing-price-value"
              className={styles.sliderValue}
              aria-live="polite"
            >
              {formatCurrencyBrl(price)}
            </p>
            <input
              id="listing-price"
              className={styles.slider}
              type="range"
              min={cfg.min}
              max={cfg.max}
              step={cfg.step}
              value={price}
              disabled={busy}
              aria-valuemin={cfg.min}
              aria-valuemax={cfg.max}
              aria-valuenow={price}
              aria-valuetext={formatCurrencyBrl(price)}
              aria-labelledby="listing-price-value"
              onChange={(e) => {
                setPrice(Number(e.target.value))
                setErrors((p) => ({ ...p, price: undefined }))
              }}
            />
            <div className={styles.sliderMeta}>
              <span>{formatCurrencyBrl(cfg.min)}</span>
              <span>{formatCurrencyBrl(cfg.max)}</span>
            </div>
            {errors.price ? <p className={styles.fieldError}>{errors.price}</p> : null}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="location-title">
          <h2 id="location-title" className={styles.sectionTitle}>Localização</h2>

          <Field
            label="CEP"
            htmlFor="listing-cep"
            error={errors.cep}
          >
            <Input
              id="listing-cep"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={cep}
              disabled={busy}
              onChange={(e) => {
                setCep(maskCep(e.target.value))
                setErrors((p) => ({ ...p, cep: undefined }))
              }}
              onBlur={() => { void handleCepBlur() }}
            />
          </Field>
          {cepLoading ? (
            <p className={styles.cepHint} role="status">Buscando endereço…</p>
          ) : (
            <p className={styles.cepHint}>Preenchemos rua, bairro, cidade e estado automaticamente.</p>
          )}

          <Field label="Rua" htmlFor="listing-street" error={errors.street}>
            <Input
              id="listing-street"
              value={street}
              placeholder="Logradouro"
              autoComplete="address-line1"
              disabled={busy}
              onChange={(e) => {
                setStreet(e.target.value)
                setErrors((p) => ({ ...p, street: undefined }))
              }}
            />
          </Field>

          <div className={styles.row}>
            <Field label="Número" htmlFor="listing-number" error={errors.number}>
              <Input
                id="listing-number"
                value={number}
                placeholder="123"
                disabled={busy}
                onChange={(e) => {
                  setNumber(e.target.value)
                  setErrors((p) => ({ ...p, number: undefined }))
                }}
              />
            </Field>
            <Field label="Bairro" htmlFor="listing-neighborhood" error={errors.neighborhood}>
              <Input
                id="listing-neighborhood"
                value={neighborhood}
                disabled={busy}
                onChange={(e) => {
                  setNeighborhood(e.target.value)
                  setErrors((p) => ({ ...p, neighborhood: undefined }))
                }}
              />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Cidade" htmlFor="listing-city" error={errors.city}>
              <Input
                id="listing-city"
                value={city}
                disabled={busy}
                onChange={(e) => {
                  setCity(e.target.value)
                  setErrors((p) => ({ ...p, city: undefined }))
                }}
              />
            </Field>
            <Field label="Estado" htmlFor="listing-state" error={errors.state}>
              <Input
                id="listing-state"
                value={state}
                maxLength={2}
                placeholder="PR"
                disabled={busy}
                onChange={(e) => {
                  setState(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))
                  setErrors((p) => ({ ...p, state: undefined }))
                }}
              />
            </Field>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="specs-title">
          <h2 id="specs-title" className={styles.sectionTitle}>Características</h2>

          <div className={styles.stepperRow}>
            <Stepper
              id="listing-bedrooms"
              label="Quartos"
              value={bedrooms}
              disabled={busy}
              onChange={setBedrooms}
            />
            <Stepper
              id="listing-bathrooms"
              label="Banheiros"
              value={bathrooms}
              min={0}
              disabled={busy}
              onChange={setBathrooms}
            />
            <Stepper
              id="listing-parking"
              label="Vagas"
              value={parkingSpots}
              disabled={busy}
              onChange={setParkingSpots}
            />
          </div>

          <Field label="Área (m²)" htmlFor="listing-area" error={errors.area}>
            <Input
              id="listing-area"
              type="number"
              min={1}
              value={area}
              disabled={busy}
              onChange={(e) => setArea(e.target.value)}
            />
          </Field>

          <Field label="Descrição" htmlFor="listing-description" error={errors.description}>
            <textarea
              id="listing-description"
              className={styles.textarea}
              rows={5}
              value={description}
              placeholder="Conte os diferenciais do imóvel…"
              disabled={busy}
              onChange={(e) => {
                setDescription(e.target.value)
                setErrors((p) => ({ ...p, description: undefined }))
              }}
            />
          </Field>

          <fieldset className={styles.amenities}>
            <legend>Comodidades (opcional)</legend>
            <div className={styles.checkList} role="group" aria-label="Comodidades">
              {LISTING_AMENITIES.map((item) => (
                <label key={item} className={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    disabled={busy}
                    onChange={() => toggleAmenity(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.photosBlock}>
            <span className={styles.photosLabel}>Fotos do imóvel</span>
            <p className={styles.photosHint}>
              Envie até {MAX_LISTING_PHOTOS} imagens do seu computador (máx. 2 MB cada).
            </p>
            <input
              ref={photoInputRef}
              id={photoInputId}
              className={styles.fileInput}
              type="file"
              accept="image/*"
              multiple
              disabled={busy || photos.length >= MAX_LISTING_PHOTOS}
              onChange={(e) => { void handlePhotosSelected(e.target.files) }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={busy || photos.length >= MAX_LISTING_PHOTOS}
              onClick={() => photoInputRef.current?.click()}
            >
              Adicionar fotos
            </Button>
            {errors.photos ? <p className={styles.fieldError}>{errors.photos}</p> : null}

            {photos.length > 0 ? (
              <ul className={styles.photoGrid} aria-label="Pré-visualização das fotos">
                {photos.map((src, index) => (
                  <li key={`${index}-${src.slice(0, 32)}`} className={styles.photoItem}>
                    <img src={src} alt={`Foto ${index + 1}`} className={styles.photoThumb} />
                    <button
                      type="button"
                      className={styles.photoRemove}
                      aria-label={`Remover foto ${index + 1}`}
                      disabled={busy}
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.photoEmpty} aria-hidden="true">
                Nenhuma foto selecionada — usaremos um placeholder se publicar sem imagens.
              </div>
            )}
          </div>
        </section>

        <div className={styles.actions}>
          <Button type="submit" loading={createMutation.isPending}>
            Publicar anúncio
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={createMutation.isPending}
            onClick={() => navigate('/anuncios')}
          >
            Voltar
          </Button>
        </div>
      </form>
    </div>
  )
}
