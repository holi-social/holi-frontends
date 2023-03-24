import React from 'react'
import renderer from 'react-test-renderer'

import NotificationReleaseInfoItem from '@holi/core/screens/notifications/components/NotificationReleaseInfoItem'
import { NotificationReleaseInfo, NotificationType } from '@holi/core/screens/notifications/components/types'

const releaseInfoNotification: NotificationReleaseInfo = {
  id: 'e2bd2b4b-e996-4333-a5c9-0808c75f1a4e',
  notificationType: NotificationType.RELEASE_INFO,
  owner: {
    id: 'b98ea673-9b33-49ab-bc3f-a60a543533c5',
    avatarLabel: 'foo',
    avatarDefaultColor: 'red',
    fullName: 'Karsten',
  },
  created: '2023-03-23T10:30:53.608640+00:00',
  read: true,
  options: {
    post: {
      id: '893dbc08-527d-4572-936d-38bd70c6a939',
      title:
        'Someone trip loss government property like hold staff. School line three page single. Source lay popular.',
      text: '',
      creator: { id: '123', avatarLabel: 'foo', avatarDefaultColor: 'red', fullName: 'Peter' },
      numberOfComments: 0,
      commenters: { totalResults: 0, data: [] },
      myReaction: { HEART: 1 },
      reactions: { HEART: 10 },
    },
  },
}

describe('NotificationReleaseInfoItem.tsx', () => {
  it('matches snapshot', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

    const tree = renderer.create(<NotificationReleaseInfoItem notification={releaseInfoNotification} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
