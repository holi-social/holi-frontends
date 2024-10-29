import { useQuery } from '@apollo/client'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useUnseenNotificationsCount } from '@holi/core/screens/notifications/hooks/useUnseenNotificationsCount'
import { HasNewNotificationsQuery, HasNewNotificationsResponse } from '@holi/core/screens/notifications/queries'

export const useHasNewNotifications = () => {
  const { isLoggedIn } = useLoggedInUser()

  const { data } = useQuery<HasNewNotificationsResponse>(HasNewNotificationsQuery, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    pollInterval: notificationPollingInterval,
  })

  const { hasUnseenNotifications: hasUnseenNovuNotifications } = useUnseenNotificationsCount()

  return !!data?.hasNewNotifications?.status || hasUnseenNovuNotifications
}
