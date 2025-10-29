import { useMutation } from '@apollo/client/react'
import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { useLoginState } from '@holi/core/auth/loginState'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { useDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { RegisterDeviceResponse, registerDeviceMutation } from '@holi/core/screens/notifications/mutations'

const logger = getLogger('Notifications')

const DeviceRegistration = () => {
  const { isLoggedIn } = useLoginState()
  const { deviceToken } = useDeviceToken()
  const [registerDevice] = useMutation<RegisterDeviceResponse>(registerDeviceMutation, {
    onError: (error) =>
      logError(error, 'Failed to register device', {
        location: 'DeviceRegistration.registerDeviceMutation',
      }),
  })

  useEffect(() => {
    if (!isLoggedIn) {
      logger.debug('DeviceRegistration', "ignoring device token because user isn't logged in")
      return
    } else if (!deviceToken) {
      logger.debug('DeviceRegistration', "ignoring device token because it's missing")
      return
    } else {
      logger.debug('DeviceRegistration', 'registering device token', deviceToken, Platform.OS.toUpperCase())
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
