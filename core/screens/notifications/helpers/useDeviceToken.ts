import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { getDeviceToken, registerDeviceTokenListener } from '@holi/core/screens/notifications/helpers/getDeviceToken'

const logger = getLogger('Notifications')

const deviceTokenVar = makeVar<string | undefined>(undefined)
const deviceTokenInitializedVar = makeVar(false)

export const markDeviceTokenAsInitialized = () => deviceTokenInitializedVar(true)

// This requires the user to grant notification permission
export const initDeviceToken = () =>
  // Forward to platform specific implementation
  getDeviceToken()
    .then((token) => {
      logger.debug('initDeviceToken', 'got device token', token)
      if (token) {
        deviceTokenVar(token)
      }
    })
    .catch((error) => logError(error, 'Error retrieving device token', { location: 'initDeviceToken' }))
    .finally(markDeviceTokenAsInitialized)

export const subscribeToDeviceTokenChanges = () =>
  registerDeviceTokenListener((token) => {
    logger.debug('subscribeToDeviceTokenChanges', 'got device token', token)
    deviceTokenVar(token)
  })

export const useDeviceToken = () => {
  const deviceToken = useReactiveVar(deviceTokenVar)
  const deviceTokenInitialized = useReactiveVar(deviceTokenInitializedVar)
  return {
    deviceToken,
    deviceTokenInitialized,
  }
}
