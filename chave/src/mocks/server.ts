import { setupServer } from 'msw/node'
import { propertyHandlers } from './handlers/properties'
import { authHandlers } from './handlers/auth'

export const server = setupServer(...propertyHandlers, ...authHandlers)
