import { renderToString } from 'react-dom/server'

export type SsrRenderResult = {
  html: string
}

/**
 * T23 scaffold — emits a lightweight SSR marker shell.
 * T24 replaces this with route-aware React trees + catalog prefetch.
 */
export function render(url: string): SsrRenderResult {
  const html = renderToString(
    <div data-ssr="chave" data-url={url}>
      <p>Carregando Chave…</p>
    </div>,
  )
  return { html }
}
