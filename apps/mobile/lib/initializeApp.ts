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
        await Promise.all([
          initAuth().catch((e) => logError(e, 'Error on init Auth', { location: 'initializeApp' })),
          initNotifications().catch((e) => logError(e, 'Error on init notifications', { location: 'initializeApp' })),
          initI18n().catch((e) => logError(e, 'Error on init i18n', { location: 'initializeApp' })),
          Appcues.setup(appcuesAccountId, appcuesAppId).catch((e) =>
            logError(e, 'Error on init appCues', { location: 'initializeApp' })
          ),
        ]).finally(() => {
          setInitReady(true)
        })

        // Init services that are not vital for the app first rendering must stay outside
        // of the main promise
        subscribeToDeviceTokenChanges()

        logger.debug('App', 'init completed')
      } catch (error) {
        logError(error, 'Error during initializeApp()', { location: 'initializeApp.ts' })
      }
    },
  }
}
