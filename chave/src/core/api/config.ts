export const apiUrl = import.meta.env.VITE_API_URL as string
export const appEnv = import.meta.env.VITE_ENV as 'production' | 'staging' | 'mock'
export const waNumber = import.meta.env.VITE_WA_NUMBER as string
/** Browser Maps JS key — restrict by HTTP referrer in Google Cloud Console */
export const googleMapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? ''

export const isMock = appEnv === 'mock'
export const hasGoogleMaps = googleMapsApiKey.length > 0
