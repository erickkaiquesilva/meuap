import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import express from 'express'
import type { ViteDevServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 5173
const resolve = (...segments: string[]) => path.resolve(__dirname, ...segments)

type RenderFn = (url: string) => Promise<{
  html: string
  title: string
  spaOnly: boolean
}>

async function createServer() {
  const app = express()

  let vite: ViteDevServer | undefined

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      root: resolve('..'),
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  } else {
    app.use(
      express.static(resolve('../dist/client'), {
        index: false,
        maxAge: '1h',
      }),
    )
  }

  app.use(async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next()
      return
    }

    const url = req.originalUrl

    try {
      let template: string
      let render: RenderFn

      if (!isProd && vite) {
        template = fs.readFileSync(resolve('../index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        const mod = await vite.ssrLoadModule('/src/entry-server.tsx')
        render = (mod as { render: RenderFn }).render
      } else {
        template = fs.readFileSync(resolve('../dist/client/index.html'), 'utf-8')
        const mod = (await import(
          pathToFileURL(resolve('../dist/server/entry-server.js')).href
        )) as { render: RenderFn }
        render = mod.render
      }

      const { html, title } = await render(url)
      const page = template
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace('<!--app-html-->', html)

      res
        .status(200)
        .set({ 'Content-Type': 'text/html; charset=utf-8' })
        .end(page)
    } catch (error) {
      if (!isProd && vite && error instanceof Error) {
        vite.ssrFixStacktrace(error)
      }
      next(error)
    }
  })

  app.listen(port, () => {
    console.log(`[ssr] http://localhost:${port} (${isProd ? 'prod' : 'dev'})`)
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

void createServer()
