import { act, render, screen } from 'expo-router/testing-library'
import React from 'react'

import NotificationReleaseInfoItem from '@holi/core/screens/notifications/components/NotificationReleaseInfoItem'
import { type NotificationReleaseInfo, NotificationType } from '@holi/core/screens/notifications/components/types'

const releaseInfoNotification: NotificationReleaseInfo = {
  id: 'e2bd2b4b-e996-4333-a5c9-0808c75f1a4e',
  notificationType: NotificationType.RELEASE_INFO,
  created: '2023-03-23T10:30:53.608640+00:00',
  read: true,
  options: {
    post: {
      id: '893dbc08-527d-4572-936d-38bd70c6a939',
      title:
        'Someone trip loss government property like hold staff. School line three page single. Source lay popular.',
      text: '',
      creator: { id: '123', avatarLabel: 'foo', avatarDefaultColor: 'red', fullName: 'Peter', identity: 'peter' },
      numberOfComments: 0,
      commenters: { totalResults: 0, data: [] },
      reactors: { totalResults: 0, data: [] },
      myReaction: { HEART: 1 },
      reactions: { HEART: 10 },
      __typename: 'FeedPost',
    },
  },
  notificationVersion: '1.0.0',
}

describe('NotificationReleaseInfoItem.tsx', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  it('matches snapshot', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

    render(<NotificationReleaseInfoItem notification={releaseInfoNotification} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
