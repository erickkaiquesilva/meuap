import { setupServer } from 'msw/node'
import { propertyHandlers } from './handlers/properties'
import { authHandlers } from './handlers/auth'
import { announcerHandlers } from './handlers/announcer'
import { adminHandlers } from './handlers/admin'
import { favoritesHandlers } from './handlers/favorites'
import { visitsHandlers } from './handlers/visits'

export const server = setupServer(
  ...propertyHandlers,
  ...authHandlers,
  ...announcerHandlers,
  ...adminHandlers,
  ...favoritesHandlers,
  ...visitsHandlers,
)
