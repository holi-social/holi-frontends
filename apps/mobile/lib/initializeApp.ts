import { initI18n } from '@holi/core/i18n'
import { initAuth } from '@holi/core/auth/helpers/init'
import { initNotifications } from '@holi/mobile/notifications/initNotifications'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { config } from '@holi/mobile/config'
import { subscribeToDeviceTokenChanges } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { useState } from 'react'
import { appcuesAccountId, appcuesAppId } from '@holi/core/helpers/config'
import * as Appcues from '@appcues/react-native'

const logger = getLogger('AppInit')

export const useAppInit = () => {
  const [initReady, setInitReady] = useState(false)
  return {
    isReady: initReady,
    initializeApp: async () => {
      logger.debug('App', 'starting app with config', config)
      try {
        await Promise.all([initAuth(), initI18n(), Appcues.setup(appcuesAccountId, appcuesAppId)]).finally(() => {
          setInitReady(true)
        })
      } catch (error) {
        logError(error, 'Error during initializeApp()', { location: 'initializeApp.ts' })
      }

      // Init services that are not vital for the app first rendering must stay outside
      // of the main promise
      subscribeToDeviceTokenChanges()
      initNotifications().catch((e) => logError(e, 'Error on init notifications', { location: 'initializeApp' }))
    },
  }
}
