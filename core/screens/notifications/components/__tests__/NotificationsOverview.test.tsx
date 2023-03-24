import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
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
            {
              id: 'e2bd2b4b-e996-4333-a5c9-0808c75f1a4e',
              notificationType: 'REL',
              owner: {
                id: 'b98ea673-9b33-49ab-bc3f-a60a543533c5',
              },
              created: '2023-03-23T10:30:53.608640+00:00',
              read: true,
              options: {
                post: {
                  id: '893dbc08-527d-4572-936d-38bd70c6a939',
                  title:
                    'Someone trip loss government property like hold staff. School line three page single. Source lay popular.',
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

    // wait for loader to be removed first
    const loaderTextContent = 'global.loading'
    await waitForElementToBeRemoved(() => screen.getByText(loaderTextContent))
    const notLoggedInMessage = 'loginRedirect.title'
    expect(await screen.findByTestId('notifications-overview')).not.toHaveTextContent(notLoggedInMessage)
    const emptyNotificationsMessage = 'notifications.display.empty.text2'
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

  it('renders a PostCommentMention and Release notification', async () => {
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

    expect(await screen.findByTestId('post-comment-mention'))
    expect(await screen.findByTestId('release-info'))
  })
})
