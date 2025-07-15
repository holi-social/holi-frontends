import { useEffect, useRef } from 'react'
import AsyncStore from '@react-native-async-storage/async-storage'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { initNotifications } from '@holi/mobile/notifications/initNotifications'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('NotificationsInit')
const NOTIFICATIONS_INITIALIZED_KEY = 'notifications_initialized'

/**
 * Hook to initialize notifications for both new and existing users.
 *
 * This hook ensures notifications are initialized only once per app installation
 * by tracking initialization state in AsyncStorage.
 */
export const useNotificationsInit = () => {
  const { isLoggedIn, isLoading } = useLoggedInUser()
  const initialized = useRef(false)

  useEffect(() => {
    // Skip if still loading auth state
    if (isLoading) return
    alert('useNotificationsInit')
    const checkAndInitNotifications = async () => {
      try {
        // Check if notifications were already initialized
        const alreadyInitialized = await AsyncStore.getItem(NOTIFICATIONS_INITIALIZED_KEY)

        if (alreadyInitialized !== 'true' && !initialized.current) {
          logger.debug('useNotificationsInit', 'Initializing notifications')
          await initNotifications().then(() => {
            alert('Notifications initialized')
          })
          await AsyncStore.setItem(NOTIFICATIONS_INITIALIZED_KEY, 'true')
          initialized.current = true
        }
      } catch (error) {
        logger.debug('useNotificationsInit', 'Failed to initialize notifications', error)
      }
    }

    // Only initialize if user is logged in
    if (isLoggedIn) {
      checkAndInitNotifications()
    }
  }, [isLoggedIn, isLoading])
}
