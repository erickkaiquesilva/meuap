import { setupWorker } from 'msw/browser'
import { propertyHandlers } from './handlers/properties'
import { authHandlers } from './handlers/auth'
import { announcerHandlers } from './handlers/announcer'

export const worker = setupWorker(...propertyHandlers, ...authHandlers, ...announcerHandlers)
