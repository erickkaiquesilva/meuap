import { setupWorker } from 'msw/browser'
import { propertyHandlers } from './handlers/properties'
import { authHandlers } from './handlers/auth'
import { announcerHandlers } from './handlers/announcer'
import { adminHandlers } from './handlers/admin'
import { favoritesHandlers } from './handlers/favorites'

export const worker = setupWorker(
  ...propertyHandlers,
  ...authHandlers,
  ...announcerHandlers,
  ...adminHandlers,
  ...favoritesHandlers,
)
