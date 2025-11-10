import { useCallback, useEffect, useState } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

export const useUnseenNotificationsCount = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { novuService } = useNotificationService()
  const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(0)

  const fetchUnseenNotificiationsCount = useCallback(
    async (logFunction = logError) =>
      novuService
        ?.getUnseenCount()
        .then((response) => setUnseenNotificationsCount(response?.count || 0))
        .catch((error) =>
          logFunction(error, 'Error retrieving unseen notifications count', {
            location: 'useUnseenNotificationsCount.fetchUnseenNotificiationsCount',
          })
        ),
    [novuService]
  )
  useEffect(() => {
    if (isLoggedIn && novuService) {
      fetchUnseenNotificiationsCount()
      const fetchIntervalId = setInterval(() => {
        // Only log errors locally without sending sentry reports
        fetchUnseenNotificiationsCount(logErrorLocal)
      }, notificationPollingInterval)

      return () => clearInterval(fetchIntervalId)
    }
  }, [fetchUnseenNotificiationsCount, novuService, isLoggedIn])

  return { hasUnseenNotifications: !!unseenNotificationsCount, unseenNotificationsCount }
}
