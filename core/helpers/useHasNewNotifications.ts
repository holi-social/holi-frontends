import { useQuery } from '@apollo/client'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { HasNewNotificationsQuery, HasNewNotificationsResponse } from '@holi/core/screens/notifications/queries'

export const useHasNewNotifications = () => {
  const { isLoggedIn } = useLoggedInUser()

  const { data } = useQuery<HasNewNotificationsResponse>(HasNewNotificationsQuery, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    pollInterval: notificationPollingInterval,
  })

  return !!data?.hasNewNotifications?.status
}
