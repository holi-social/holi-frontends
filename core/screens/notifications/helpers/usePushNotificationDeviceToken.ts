import { makeVar, useReactiveVar } from '@apollo/client'
import { Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { getPushNotificationDeviceToken } from '@holi/core/screens/notifications/helpers/getPushNotificationDeviceToken'

const deviceTokenVar = makeVar<string | undefined>(undefined)
// Currently push notifications are not supported on web and "initPushNotificationDeviceToken" is not called there,
// so the (undefined) device token can be treated as "initialized"
const deviceTokenInitializedVar = makeVar(Platform.OS === 'web')

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
    .finally(() => deviceTokenInitializedVar(true))

export const usePushNotificationDeviceToken = () => {
  const deviceToken = useReactiveVar(deviceTokenVar)
  const deviceTokenInitialized = useReactiveVar(deviceTokenInitializedVar)
  return {
    deviceToken,
    deviceTokenInitialized,
  }
}
