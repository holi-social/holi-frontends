import { MockedProvider } from '@apollo/client/testing'
import React from 'react'

import {
  NotificationGroup,
  NotificationsSectionList,
} from '@holi/core/screens/notifications/components/NotificationsSectionList'
import {
  notificationConnectionRequest,
  notificationSpaceConnectionRequest,
} from '@holi/core/screens/notifications/components/seedData'

export default {
  title: 'Organisms/NotificationsOverview',
  parameters: {
    docs: {
      description: {
        component: 'Holi - notifications .',
      },
    },
  },
}

const notifications: NotificationGroup[] = [
  {
    data: [notificationConnectionRequest, notificationSpaceConnectionRequest],
    title: 'Title',
  },
]

export function All() {
  return (
    // mock the apollo dependency in the rather-coupled notification item components
    <MockedProvider>
      <NotificationsSectionList notifications={notifications} />
    </MockedProvider>
  )
}
