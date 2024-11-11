import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import { type LoggedInState, useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import NotificationSpaceConnectionItem from '@holi/core/screens/notifications/components/NotificationSpaceConnectionItem'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { dummyUser, notificationSpaceConnectionRequest } from '@holi/core/screens/notifications/components/seedData'
import { NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import { updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/details/mutations'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.mock('@holi/core/auth/hooks/useLoggedInUser')
const useLoggedInUserMock = jest.mocked(useLoggedInUser)
const loggedIn = {
  isLoading: false,
  isLoggedOut: false,
  isLoggedIn: true,
  user: { id: '123' },
} as LoggedInState

// prevent warnings about incomplete apollo mocks,
// which aren't used as we only test the loading indicator
global.console.warn = jest.fn()

const acceptRequest = {
  request: {
    query: updateSpaceUserConnectionMutation,
    variables: {
      connectAction: SpaceConnectionAction.CONNECT,
      connectionType: SpaceConnectionType.MEMBER,
      userId: notificationSpaceConnectionRequest.options.user.id,
      spaceId: notificationSpaceConnectionRequest.options.space.id,
    },
  },
  newData: jest.fn(() => {
    return {}
  }),
}
const declineRequest = {
  request: {
    query: updateSpaceUserConnectionMutation,
    variables: {
      connectAction: SpaceConnectionAction.DISCONNECT,
      connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
      userId: notificationSpaceConnectionRequest.options.user.id,
      spaceId: notificationSpaceConnectionRequest.options.space.id,
    },
  },
  newData: jest.fn(() => {
    return {}
  }),
}

const MOCKS = [acceptRequest, declineRequest]

describe('NotificationSpaceConnectionItem', () => {
  beforeEach(() => {
    useLoggedInUserMock.mockReturnValue(loggedIn)
    jest.useRealTimers()
  })

  describe('with legacy notifications', () => {
    const notification = notificationSpaceConnectionRequest

    it('matches snapshot', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

      render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <NotificationSpaceConnectionItem notification={notification} />
        </MockedProvider>
      )
      expect(screen).toMatchSnapshot()
    })

    it('renders loader after declining a connection request', async () => {
      const { getByTestId } = render(
        <ToastProvider>
          <MockedProvider mocks={MOCKS} addTypename={false}>
            <NotificationSpaceConnectionItem notification={notification} />
          </MockedProvider>
        </ToastProvider>
      )

      fireEvent(getByTestId('decline-connection-request-button'), 'click')
      expect(declineRequest.newData).toHaveBeenCalled()
      expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

      await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
    })

    it('renders loader after accepting a connection request', async () => {
      const { getByTestId } = render(
        <ToastProvider>
          <MockedProvider mocks={MOCKS} addTypename={false}>
            <NotificationSpaceConnectionItem notification={notification} />
          </MockedProvider>
        </ToastProvider>
      )

      fireEvent(getByTestId('accept-connection-request-button'), 'click')
      expect(acceptRequest.newData).toHaveBeenCalled()
      expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

      await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
    })
  })

  describe('with novu notifications', () => {
    const notification = {
      id: '0809f4a0-04c8-43ae-a291-4f7bfce1b123',
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
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
        message: 'I would like to join!',
      },
      content: 'Some User wants to join the Space Foo\nI would like to join!',
      notificationVersion: '1.0.0',
    } as NotificationSpaceConnection

    it('notification for membership request matches snapshot', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

      render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <NotificationSpaceConnectionItem notification={notification} />
        </MockedProvider>
      )

      expect(screen).toMatchSnapshot()
    })

    it('renders loader after declining a connection request', async () => {
      const { getByTestId } = render(
        <ToastProvider>
          <MockedProvider mocks={MOCKS} addTypename={false}>
            <NotificationSpaceConnectionItem notification={notification} />
          </MockedProvider>
        </ToastProvider>
      )

      fireEvent(getByTestId('decline-connection-request-button'), 'click')
      expect(declineRequest.newData).toHaveBeenCalled()
      expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

      await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
    })

    it('renders loader after accepting a connection request', async () => {
      const { getByTestId } = render(
        <ToastProvider>
          <MockedProvider mocks={MOCKS} addTypename={false}>
            <NotificationSpaceConnectionItem notification={notification} />
          </MockedProvider>
        </ToastProvider>
      )

      fireEvent(getByTestId('accept-connection-request-button'), 'click')
      expect(acceptRequest.newData).toHaveBeenCalled()
      expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

      await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
    })
  })
})
