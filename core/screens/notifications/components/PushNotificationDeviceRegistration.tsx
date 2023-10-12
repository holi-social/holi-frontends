import { useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { logError } from '@holi/core/errors/helpers'
import { usePushNotificationDeviceToken } from '@holi/core/screens/notifications/helpers/usePushNotificationDeviceToken'
import { RegisterDeviceResponse, registerDeviceMutation } from '@holi/core/screens/notifications/mutations'

const PushNotificationDeviceRegistration = () => {
  const { isLoggedIn } = useAuth()
  const { deviceToken } = usePushNotificationDeviceToken()
  const [registerDevice] = useMutation<RegisterDeviceResponse>(registerDeviceMutation, {
    onError: (error) =>
      logError(error, 'Failed to register device', {
        location: 'PushNotificationDeviceRegistration.registerDeviceMutation',
      }),
  })

  useEffect(() => {
    if (isLoggedIn && deviceToken) {
      registerDevice({
        variables: {
          input: {
            token: deviceToken,
            deviceType: Platform.OS.toUpperCase(),
          },
        },
      })
    }
  }, [isLoggedIn, deviceToken, registerDevice])

  return null
}

export default withProfiler(PushNotificationDeviceRegistration, { name: 'PushNotificationDeviceRegistration' })
