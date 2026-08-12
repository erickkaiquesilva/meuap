import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import '@/assets/ds/main.css'
import '@/index.css'
import { queryClient } from '@/core/query/queryClient'
import { router } from '@/core/router/routes'
import { isMock } from '@/core/api/config'

async function bootstrap() {
  if (isMock) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'warn' })
  }

  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')

  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

bootstrap()
