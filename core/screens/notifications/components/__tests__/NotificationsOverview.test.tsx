import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import Notifications from '@holi/core/screens/notifications/Notifications'
import { notificationsQuery } from '@holi/core/screens/notifications/queries'

const MOCKS_EMPTY = [
  {
    request: {
      query: notificationsQuery,
      variables: {
        offset: 0,
        limit: 100,
      },
    },
    result: {
      data: {
        notifications: {
          data: [
            {
              id: 'a7aaf131-f1bc-42c3-be76-347afe854776',
              notificationType: 'NOT_RENDERED_TYPE',
              owner: {
                id: 'b98ea673-9b33-49ab-bc3f-a60a543533c5',
              },
              created: '2023-01-02T15:35:58.163730+00:00',
            },
          ],
        },
      },
    },
  },
]

const MOCKS_WITH_NOTIFICATIONS = [
  {
    request: {
      query: notificationsQuery,
      variables: {
        offset: 0,
        limit: 100,
      },
    },
    result: {
      data: {
        notifications: {
          data: [
            {
              id: 'a7aaf131-f1bc-42c3-be76-347afe854773',
              notificationType: 'PCUM',
              owner: {
                id: 'b98ea673-9b33-49ab-bc3f-a60a543533c5',
              },
              created: '2023-01-02T15:35:58.163730+00:00',
              options: {
                user: {
                  id: 'b98ea673-9b33-49ab-bc3f-a60a543533c5',
                },
                postComment: {
                  id: '111',
                  post: {
                    id: '333',
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
]

describe('Notifications.tsx', () => {
  it('shows login message, when user is not logged in', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: false,
          userId: null,
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
          <Notifications />
        </MockedProvider>
      </AuthContext.Provider>
    )

    const notLoggedInMessage = 'loginRedirect.title'
    expect(await screen.findByText(notLoggedInMessage))
  })

  it('shows empty message, when no proper notification is given', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: true,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
          <Notifications />
        </MockedProvider>
      </AuthContext.Provider>
    )

    const notLoggedInMessage = 'loginRedirect.title'
    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    expect(await screen.findByTestId('notifications-overview')).not.toHaveTextContent(notLoggedInMessage)
    expect(await screen.findByTestId('notifications-overview')).toHaveTextContent(emptyNotificationsMessage)
  })

  it('does not show an empty message when proper notifications are given', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: true,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
          <Notifications />
        </MockedProvider>
      </AuthContext.Provider>
    )

    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    expect(await screen.findByTestId('notifications-overview')).not.toHaveTextContent(emptyNotificationsMessage)
  })
})
