const GIS_SRC = 'https://accounts.google.com/gsi/client'

type CredentialResponse = { credential?: string }
type PromptNotification = {
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
  isDismissedMoment: () => boolean
}

type GoogleIdApi = {
  initialize: (config: {
    client_id: string
    callback: (response: CredentialResponse) => void
    auto_select?: boolean
    ux_mode?: 'popup' | 'redirect'
  }) => void
  prompt: (callback?: (notification: PromptNotification) => void) => void
  cancel?: () => void
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdApi } }
  }
}

let scriptPromise: Promise<void> | null = null

function loadGisScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google Identity failed to load')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Google Identity failed to load'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function requestGoogleCredential(clientId: string): Promise<string> {
  await loadGisScript()
  const gis = window.google?.accounts?.id
  if (!gis) throw new Error('Google Identity is unavailable')

  return new Promise((resolve, reject) => {
    gis.initialize({
      client_id: clientId,
      auto_select: false,
      ux_mode: 'popup',
      callback: (response) => {
        if (response.credential) {
          resolve(response.credential)
          return
        }
        reject(new Error('Google did not return a credential'))
      },
    })

    gis.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
        reject(new Error('Google sign-in was dismissed'))
      }
    })
  })
}
