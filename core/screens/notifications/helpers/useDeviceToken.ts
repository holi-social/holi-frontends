import { makeVar, useReactiveVar } from '@apollo/client'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { getDeviceToken } from '@holi/core/screens/notifications/helpers/getDeviceToken'

const deviceTokenVar = makeVar<string | undefined>(undefined)
const deviceTokenInitializedVar = makeVar(false)

export const markDeviceTokenAsInitialized = () => deviceTokenInitializedVar(true)

// This requires the user to grant notification permission
export const initDeviceToken = () =>
  // Forward to platform specific implementation
  getDeviceToken()
    .then((token) => {
      logDebug('initDeviceToken', 'got device token', token)
      if (token) {
        deviceTokenVar(token)
      }
    })
    .catch((error) => logError(error, 'Error retrieving device token', { location: 'initDeviceToken' }))
    .finally(markDeviceTokenAsInitialized)

export const useDeviceToken = () => {
  const deviceToken = useReactiveVar(deviceTokenVar)
  const deviceTokenInitialized = useReactiveVar(deviceTokenInitializedVar)
  return {
    deviceToken,
    deviceTokenInitialized,
  }
}
