import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import Notifications from '@holi/core/screens/notifications/Notifications'
import { notificationsQuery } from '@holi/core/screens/notifications/queries'
import { authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

const loggedIn = () => ({ userId: '123' })
const loggedOut = () => ({ userId: null })
const useAuthMock = useAuth as jest.Mock

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: jest.fn(),
  setUserLoggedOut: jest.fn(),
}))

const mockOpenToast = jest.fn()
jest.mock('@holi/ui/components/molecules/HoliToastProvider', () => {
  const original = jest.requireActual('@holi/ui/components/molecules/HoliToastProvider')
  return {
    ...original,
    useToast: () => ({
      openToast: mockOpenToast,
    }),
  }
})

const authenticatedUserRequest = {
  request: {
    query: authenticatedUserQuery,
    variables: {},
  },
  result: {
    data: {
      authenticatedUser: {
        id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
        avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
        fullName: 'EE. Visited',
        firstName: 'EE.',
        lastName: 'Visited',
        aboutMe: "I'm the User that is visited in E2E tests!",
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'EV',
      },
    },
  },
}

const MOCKS_EMPTY = [
  authenticatedUserRequest,
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
  authenticatedUserRequest,
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
            {
              id: '93fab88d-7288-437d-89c1-c98239bf07be',
              notificationType: 'CNP',
              owner: {
                id: 'b98ea673-9b33-49ab-bc3f-a60a543533c5',
              },
              created: '2023-04-11T07:14:47.182499+00:00',
              read: true,
              options: {
                post: {
                  id: '9f7b6baa-9987-43ed-8202-ee9a9f2b0c96',
                  title: '',
                  isPublic: true,
                  creator: {
                    id: '84727e70-2b1c-4b44-b7c3-3b6d08362ab7',
                    fullName: 'Mr. Foo Bar',
                  },
                },
                user: null,
                postComment: null,
                space: {
                  id: '2a64b5ad-399c-42c9-bf10-19ab82c16591',
                  title: 'Test space',
                },
                teaser: 'Test space post...',
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
    useAuthMock.mockImplementation(loggedOut)

    render(
      <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    const notLoggedInMessage = 'loginRedirect.title'
    expect(await screen.findByText(notLoggedInMessage))
  })

  it('shows empty message, when no proper notification is given', async () => {
    useAuthMock.mockImplementation(loggedIn)

    render(
      <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    // wait for user to be loaded
    const loaderTextContent = 'loginRedirect.title'
    await waitForElementToBeRemoved(() => screen.getByText(loaderTextContent))
    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    expect(await screen.findByTestId('notifications-overview')).toHaveTextContent(emptyNotificationsMessage)
  })

  it('does not show an empty message when proper notifications are given', async () => {
    useAuthMock.mockImplementation(loggedIn)

    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    expect(await screen.findByTestId('notifications-overview')).not.toHaveTextContent(emptyNotificationsMessage)
  })

  it('renders a PostCommentMention, a SpacePost and a Release notification', async () => {
    useAuthMock.mockImplementation(loggedIn)

    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    expect(await screen.findByTestId('post-comment-mention'))
    expect(await screen.findByTestId('release-info'))
    expect(await screen.findByTestId('space-post'))
  })
})
