import { useState, useCallback } from 'react'
import { initI18n } from '@holi/core/i18n'
import { initAuth } from '@holi/core/auth/helpers/init'
import { initNotifications } from '@holi/mobile/notifications/initNotifications'
import { subscribeToDeviceTokenChanges } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { config } from '@holi/mobile/config'
import { appcuesAccountId, appcuesAppId } from '@holi/core/helpers/config'
import * as Appcues from '@appcues/react-native'
import { Linking } from 'react-native'

const logger = getLogger('AppInit')

const useAppcuesLinksListener = () => {
  const startListener = useCallback(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      await Appcues.didHandleURL(url)
    }

    const subscription = Linking.addEventListener('url', handleUrl)
    const unsubscribeDeviceToken = subscribeToDeviceTokenChanges

    return () => {
      subscription.remove?.()
      unsubscribeDeviceToken?.()
    }
  }, [])

  return { startListener }
}

export const useAppInit = () => {
  const [initReady, setInitReady] = useState(false)
  const { startListener } = useAppcuesLinksListener()
  return {
    isReady: initReady,
    initializeApp: async () => {
      if (initReady) {
        return
      }

      logger.debug('App', 'starting app with config', config)

      // Start listening for device token updates early
      subscribeToDeviceTokenChanges()

      try {
        // Blocking, wait for required services
        await Promise.all([
          initAuth().catch((e) => logError(e, 'Error on init Auth', { location: 'initializeApp' })),
          initNotifications().catch((e) =>
            logError(e, 'Error on Notifications init Auth', { location: 'initializeApp' })
          ),
          initI18n().catch((e) => logError(e, 'Error on init i18n', { location: 'initializeApp' })),
          Appcues.setup(appcuesAccountId, appcuesAppId)
            .then(() => {
              startListener()
            })
            .catch((e) => logError(e, 'Error on init Appcues', { location: 'initializeApp' })),
        ])
      } catch (error) {
        // Maybe we could add some error state to this hook to show an alert, banner or something?? idk
        logError(error, 'Error during initializeApp()', {
          location: 'initializeApp.ts',
        })
      } finally {
        setInitReady(true)
      }

      // Non-blocking services below here
      initNotifications().catch((e) =>
        logError(e, 'Error on init notifications', {
          location: 'initializeApp',
        })
      )

      logger.debug('App', 'init completed')
    },
  }
}
