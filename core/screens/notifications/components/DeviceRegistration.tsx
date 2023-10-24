import { useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { logError } from '@holi/core/errors/helpers'
import { useDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { RegisterDeviceResponse, registerDeviceMutation } from '@holi/core/screens/notifications/mutations'

const DeviceRegistration = () => {
  const { isLoggedIn } = useAuth()
  const { deviceToken } = useDeviceToken()
  const [registerDevice] = useMutation<RegisterDeviceResponse>(registerDeviceMutation, {
    onError: (error) =>
      logError(error, 'Failed to register device', {
        location: 'DeviceRegistration.registerDeviceMutation',
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

export default withProfiler(DeviceRegistration, { name: 'DeviceRegistration' })
