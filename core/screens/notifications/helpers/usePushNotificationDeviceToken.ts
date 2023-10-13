import { makeVar, useReactiveVar } from '@apollo/client'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { getPushNotificationDeviceToken } from '@holi/core/screens/notifications/helpers/getPushNotificationDeviceToken'

const deviceTokenVar = makeVar<string | undefined>(undefined)
const deviceTokenInitializedVar = makeVar(false)

export const markPushNotificationDeviceTokenAsInitialized = () => deviceTokenInitializedVar(true)

// This requires the user to grant notification permission
export const initPushNotificationDeviceToken = () =>
  // Forward to platform specific implementation
  getPushNotificationDeviceToken()
    .then((token) => {
      logDebug('initPushNotificationDeviceToken', 'got device token', token)
      if (token) {
        deviceTokenVar(token)
      }
    })
    .catch((error) => logError(error, 'Error retrieving device token', { location: 'initPushNotificationDeviceToken' }))
    .finally(markPushNotificationDeviceTokenAsInitialized)

export const usePushNotificationDeviceToken = () => {
  const deviceToken = useReactiveVar(deviceTokenVar)
  const deviceTokenInitialized = useReactiveVar(deviceTokenInitializedVar)
  return {
    deviceToken,
    deviceTokenInitialized,
  }
}
