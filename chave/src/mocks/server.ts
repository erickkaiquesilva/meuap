import { setupServer } from 'msw/node'
import { propertyHandlers } from './handlers/properties'
import { authHandlers } from './handlers/auth'
import { announcerHandlers } from './handlers/announcer'
import { adminHandlers } from './handlers/admin'

export const server = setupServer(
  ...propertyHandlers,
  ...authHandlers,
  ...announcerHandlers,
  ...adminHandlers,
)
