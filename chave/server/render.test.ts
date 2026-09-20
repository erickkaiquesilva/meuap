import { describe, expect, it } from 'vitest'
import { render } from './render'
import { matchSsrRoute } from './ssrRoutes'

describe('matchSsrRoute', () => {
  it('classifies public and spa routes', () => {
    expect(matchSsrRoute('/')).toEqual({ kind: 'home' })
    const listings = matchSsrRoute('/imoveis?city=Maringá')
    expect(listings).toMatchObject({ kind: 'listings' })
    if (listings.kind === 'listings') {
      expect(listings.search).toContain('city=')
    }
    expect(matchSsrRoute('/imoveis/1')).toEqual({ kind: 'property', id: '1' })
    expect(matchSsrRoute('/anuncios')).toEqual({ kind: 'spa' })
    expect(matchSsrRoute('/anuncios/novo')).toEqual({ kind: 'spa' })
    expect(matchSsrRoute('/entrar')).toEqual({ kind: 'spa' })
  })
})

describe('render (SSR public routes)', () => {
  it('renders home with default title and featured links', async () => {
    const result = await render('/')
    expect(result.spaOnly).toBe(false)
    expect(result.title).toContain('Chave')
    expect(result.html).toContain('data-ssr="home"')
    expect(result.html).toContain('Destaques')
  })

  it('puts the listing title in the document title for /imoveis/:id', async () => {
    const result = await render('/imoveis/1')
    expect(result.spaOnly).toBe(false)
    expect(result.title).toContain('Apartamento 2 Quartos com Varanda — Zona 7')
    expect(result.html).toContain('Apartamento 2 Quartos com Varanda — Zona 7')
    expect(result.html).toContain('data-ssr="property"')
  })

  it('leaves SPA routes client-only (empty body)', async () => {
    const result = await render('/anuncios')
    expect(result.spaOnly).toBe(true)
    expect(result.html).toBe('')
  })

  it('renders listings index shell', async () => {
    const result = await render('/imoveis')
    expect(result.spaOnly).toBe(false)
    expect(result.title).toContain('Imóveis')
    expect(result.html).toContain('data-ssr="listings"')
  })
})
