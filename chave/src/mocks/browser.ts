import { setupWorker } from 'msw/browser'
import { propertyHandlers } from './handlers/properties'
import { authHandlers } from './handlers/auth'

export const worker = setupWorker(...propertyHandlers, ...authHandlers)
