import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Field, Input, Select } from '@/shared/components/Field/Field'
import { Button } from '@/shared/components/Button/Button'
import type { CreateListingInput } from '../types/listings'
import { useCreateMyListing } from '../hooks/useMyListings'
import {
  LISTING_AMENITIES,
  LISTING_CITIES,
  LISTING_NEIGHBORHOODS,
  LISTING_OPERATIONS,
  LISTING_TYPES,
} from '../constants/listingForm'
import styles from './NewListingPage.module.css'

type FormErrors = Partial<Record<keyof CreateListingInput | 'form', string>>

function parseIntOrZero(value: string): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function NewListingPage() {
  const navigate = useNavigate()
  const createMutation = useCreateMyListing()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<CreateListingInput['type']>('apartment')
  const [operation, setOperation] = useState<CreateListingInput['operation']>('rent')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState<string>(LISTING_CITIES[0])
  const [neighborhood, setNeighborhood] = useState(
    LISTING_NEIGHBORHOODS[LISTING_CITIES[0]][0],
  )
  const [address, setAddress] = useState('')
  const [bedrooms, setBedrooms] = useState('2')
  const [bathrooms, setBathrooms] = useState('1')
  const [parkingSpots, setParkingSpots] = useState('1')
  const [area, setArea] = useState('60')
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [photoUrl, setPhotoUrl] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')

  const neighborhoods = useMemo(
    () => LISTING_NEIGHBORHOODS[city] ?? [],
    [city],
  )

  function toggleAmenity(value: string) {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!title.trim() || title.trim().length < 8) {
      next.title = 'Título com pelo menos 8 caracteres'
    }
    const priceNum = Number(price)
    if (!price || !Number.isFinite(priceNum) || priceNum <= 0) {
      next.price = 'Informe um preço válido'
    }
    if (!city) next.city = 'Selecione a cidade'
    if (!neighborhood) next.neighborhood = 'Selecione o bairro'
    if (!address.trim() || address.trim().length < 5) {
      next.address = 'Informe o endereço'
    }
    if (parseIntOrZero(bedrooms) < 0) next.bedrooms = 'Quartos inválidos'
    if (parseIntOrZero(bathrooms) < 0) next.bathrooms = 'Banheiros inválidos'
    if (parseIntOrZero(parkingSpots) < 0) next.parkingSpots = 'Vagas inválidas'
    if (parseIntOrZero(area) <= 0) next.area = 'Área deve ser maior que zero'
    if (!description.trim() || description.trim().length < 20) {
      next.description = 'Descrição com pelo menos 20 caracteres'
    }
    if (photoUrl.trim()) {
      try {
        const url = new URL(photoUrl.trim())
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          next.photoUrl = 'URL da foto inválida'
        }
      } catch {
        next.photoUrl = 'URL da foto inválida'
      }
    }
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const payload: CreateListingInput = {
      title: title.trim(),
      type,
      operation,
      price: Number(price),
      city,
      neighborhood,
      address: address.trim(),
      bedrooms: parseIntOrZero(bedrooms),
      bathrooms: parseIntOrZero(bathrooms),
      parkingSpots: parseIntOrZero(parkingSpots),
      area: parseIntOrZero(area),
      description: description.trim(),
      amenities,
      photoUrl: photoUrl.trim() || undefined,
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

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Novo anúncio</h1>
          <p className={styles.sub}>
            Preencha os dados do imóvel. Você poderá gerenciar depois em Meus anúncios.
          </p>
        </div>
        <Link to="/anuncios" className="btn btn-outline btn-sm">
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
              disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
                onChange={(e) => setOperation(e.target.value as CreateListingInput['operation'])}
              >
                {LISTING_OPERATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field
            label={operation === 'rent' ? 'Aluguel mensal (R$)' : 'Preço de venda (R$)'}
            htmlFor="listing-price"
            error={errors.price}
          >
            <Input
              id="listing-price"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={price}
              placeholder="2400"
              disabled={createMutation.isPending}
              onChange={(e) => {
                setPrice(e.target.value)
                setErrors((p) => ({ ...p, price: undefined }))
              }}
            />
          </Field>
        </section>

        <section className={styles.section} aria-labelledby="location-title">
          <h2 id="location-title" className={styles.sectionTitle}>Localização</h2>

          <div className={styles.row}>
            <Field label="Cidade" htmlFor="listing-city" error={errors.city}>
              <Select
                id="listing-city"
                value={city}
                disabled={createMutation.isPending}
                onChange={(e) => {
                  const nextCity = e.target.value
                  setCity(nextCity)
                  setNeighborhood(LISTING_NEIGHBORHOODS[nextCity]?.[0] ?? '')
                  setErrors((p) => ({ ...p, city: undefined, neighborhood: undefined }))
                }}
              >
                {LISTING_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Bairro" htmlFor="listing-neighborhood" error={errors.neighborhood}>
              <Select
                id="listing-neighborhood"
                value={neighborhood}
                disabled={createMutation.isPending}
                onChange={(e) => {
                  setNeighborhood(e.target.value)
                  setErrors((p) => ({ ...p, neighborhood: undefined }))
                }}
              >
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Endereço" htmlFor="listing-address" error={errors.address}>
            <Input
              id="listing-address"
              value={address}
              placeholder="Rua, número"
              autoComplete="street-address"
              disabled={createMutation.isPending}
              onChange={(e) => {
                setAddress(e.target.value)
                setErrors((p) => ({ ...p, address: undefined }))
              }}
            />
          </Field>
        </section>

        <section className={styles.section} aria-labelledby="specs-title">
          <h2 id="specs-title" className={styles.sectionTitle}>Características</h2>

          <div className={styles.row4}>
            <Field label="Quartos" htmlFor="listing-bedrooms" error={errors.bedrooms}>
              <Input
                id="listing-bedrooms"
                type="number"
                min={0}
                value={bedrooms}
                disabled={createMutation.isPending}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </Field>
            <Field label="Banheiros" htmlFor="listing-bathrooms" error={errors.bathrooms}>
              <Input
                id="listing-bathrooms"
                type="number"
                min={0}
                value={bathrooms}
                disabled={createMutation.isPending}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </Field>
            <Field label="Vagas" htmlFor="listing-parking" error={errors.parkingSpots}>
              <Input
                id="listing-parking"
                type="number"
                min={0}
                value={parkingSpots}
                disabled={createMutation.isPending}
                onChange={(e) => setParkingSpots(e.target.value)}
              />
            </Field>
            <Field label="Área (m²)" htmlFor="listing-area" error={errors.area}>
              <Input
                id="listing-area"
                type="number"
                min={1}
                value={area}
                disabled={createMutation.isPending}
                onChange={(e) => setArea(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Descrição" htmlFor="listing-description" error={errors.description}>
            <textarea
              id="listing-description"
              className={styles.textarea}
              rows={5}
              value={description}
              placeholder="Conte os diferenciais do imóvel…"
              disabled={createMutation.isPending}
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
                    disabled={createMutation.isPending}
                    onChange={() => toggleAmenity(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>

          <Field
            label="URL da foto (opcional)"
            htmlFor="listing-photo"
            error={errors.photoUrl}
          >
            <Input
              id="listing-photo"
              type="url"
              value={photoUrl}
              placeholder="https://…"
              disabled={createMutation.isPending}
              onChange={(e) => {
                setPhotoUrl(e.target.value)
                setErrors((p) => ({ ...p, photoUrl: undefined }))
              }}
            />
          </Field>
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
