import { render } from 'expo-router/testing-library'
import React from 'react'

import NotificationSpaceItem from '@holi/core/screens/notifications/components/NotificationSpaceItem'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { dummyUser } from '@holi/core/screens/notifications/components/seedData'
import type { NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'

jest.mock('react-i18next', () => {
  const original = jest.requireActual('react-i18next')
  return {
    ...original,
    Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  }
})

describe('NotificationSpaceItem', () => {
  const notificationContent = 'You are now a collaborator in Space Foo'
  const requestMessage = 'Some message'
  const notification: NotificationSpaceConnection = {
    id: '0809f4a0-04c8-43ae-a291-4f7bfce1b123',
    notificationType: NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER,
    created: '2022-12-21T11:11:38.978527+00:00',
    read: false,
    options: {
      user: dummyUser,
      space: {
        id: '9cbe7f41-acb6-400d-b765-c106a4f6f5f8',
        title: 'Foo',
        avatar: 'https://ik.imagekit.io/holidev/community/9cbe7f41-acb6-400d-b765-c106a4f6f5f8_3pviGfhQJ.jpg',
        name: 'foo',
        avatarDefaultColor: '#78EDA8',
      },
      message: requestMessage,
    },
    content: notificationContent,
    notificationVersion: '1.0.0',
  }

  it('displays translated message', () => {
    const i18nKey = 'notifications.space.invite.accepted.message'
    const { queryByText } = render(<NotificationSpaceItem notification={notification} i18nKey={i18nKey} />)

    expect(queryByText(i18nKey)).toBeTruthy()
    expect(queryByText(notificationContent)).toBeFalsy()
  })

  it('displays notification content if no i18n key was provided', () => {
    const { queryByText } = render(<NotificationSpaceItem notification={notification} />)

    expect(queryByText(notificationContent)).toBeTruthy()
  })

  it('displays request message if no notification content is provided', () => {
    const { queryByText } = render(
      <NotificationSpaceItem
        notification={{ ...notification, content: undefined }}
        i18nKey="notifications.space.invite.accepted.message"
      />
    )

    expect(queryByText(requestMessage)).toBeTruthy()
  })

  it('should not display request message if notification content is provided', () => {
    const { queryByText } = render(<NotificationSpaceItem notification={notification} />)

    expect(queryByText(requestMessage)).toBeFalsy()
  })
})
