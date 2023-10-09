import { MockedProvider } from '@apollo/client/testing'
import React from 'react'

import {
  NotificationGroup,
  NotificationsSectionList,
} from '@holi/core/screens/notifications/components/NotificationsSectionList'
import {
  communityMembershipRequest,
  connectionConfirmed,
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
    data: [connectionConfirmed],
    title: 'Basic',
  },
  {
    data: [communityMembershipRequest, notificationConnectionRequest, notificationSpaceConnectionRequest],
    title: 'Interactive',
  },
]

//todo gregor: this file should live next to its implementation which currently is in core, but should be in packages/ui

export function All() {
  return (
    // mock the apollo dependency in the rather-coupled notification item components
    <MockedProvider>
      <NotificationsSectionList notifications={notifications} />
    </MockedProvider>
  )
}
