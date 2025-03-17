import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import { type LoginState, useLoginState } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import Notifications from '@holi/core/screens/notifications/Notifications'
import { LastSeenNotificationMutation, notificationsQuery } from '@holi/core/screens/notifications/queries'

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const loggedIn = (): LoginState => ({
  isUnknown: false,
  isLoggedOut: false,
  isLoggedIn: true,
  userId: '123',
})
const loggedOut = (): LoginState => ({
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
})
const useLoginStateMock = useLoginState as jest.Mock
const mockUseNotifications = jest.fn()

jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
  setLoginStateLoggedOut: jest.fn(),
}))

jest.mock('@holi/core/screens/notifications/hooks/useNotifications', () => ({
  useNotifications: () => mockUseNotifications(),
}))

const authenticatedUserRequest = {
  request: {
    query: authenticatedUserV2Query,
    variables: { userId: '123' },
  },
  result: {
    data: {
      authenticatedUserV2: {
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

const lastSeeNotificationRequest = {
  request: {
    query: LastSeenNotificationMutation,
    variables: { notificationId: 'a7aaf131-f1bc-42c3-be76-347afe854773' },
  },
  result: {
    data: {
      lastSeenNotification: {
        id: 'a7aaf131-f1bc-42c3-be76-347afe854773',
        status: false,
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
          data: [],
          totalResults: 0,
        },
      },
    },
  },
]

const MOCKS_UNSUPPORTED_NOTIFICATION = [
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
              read: false,
            },
          ],
          totalResults: 1,
        },
      },
    },
  },
]

const MOCKS_WITH_NOTIFICATIONS = [
  authenticatedUserRequest,
  lastSeeNotificationRequest,
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
          totalResults: 2,
          data: [
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
              notificationType: 'SPACE_NEW_POST',

              created: '2023-04-11T07:14:47.182499+00:00',
              read: true,
              options: {
                post: {
                  id: '9f7b6baa-9987-43ed-8202-ee9a9f2b0c96',
                  title: '',
                  isPublic: true,
                },
                user: {
                  id: '84727e70-2b1c-4b44-b7c3-3b6d08362ab7',
                  fullName: 'Mr. Foo Bar',
                },
                space: {
                  id: '2a64b5ad-399c-42c9-bf10-19ab82c16591',
                  title: 'Test space',
                },
              },
            },
          ],
        },
      },
    },
  },
]

const novuNotifications = [
  {
    id: '65425d174cfcd52172a44148',
    notificationType: 'SPACE_MEMBERSHIP_REQUEST',
    created: '2023-11-10T14:21:20.306508',
    read: false,
    options: {
      requestMessage: 'hi2',
      user: {
        id: '48e6b3c4-f1c5-4cb7-802c-75f01b3c1d05',
        fullName: 'Test SF',
        avatar: '',
        avatarBlurhash: '',
        avatarDefaultColor: '#7BD7EA',
        avatarLabel: 'TS',
      },
      space: {
        id: 'acec5d45-f7d2-45dc-bd71-add6f352bfeb',
        name: 'test',
        title: 'test',
        avatar: '',
        avatarBlurhash: '',
        avatarDefaultColor: '#7BD7EA',
      },
    },
  },
  {
    id: 'a2a93d23-3ae1-4d1c-b956-536566e07a51',
    notificationType: 'POST_COMMENT_MENTION',
    created: '2023-11-20T14:21:20.306508',
    read: false,
    content: 'Test Commenter mentioned you in a comment on Test Post Title',
    options: {
      user: {
        id: 'test_user_id',
        avatar: '',
        avatarBlurhash: '',
        avatarDefaultColor: '#000000',
        avatarLabel: '',
        fullName: 'Test User',
      },
      comment: {
        id: 'test_comment_id',
        text: 'This is a comment for Test User.',
      },
      post: {
        id: 'test_post_id',
        title: 'Test Post Title',
      },
    },
  },
  {
    id: '6cd57dd3-8092-48f4-899a-3a456e32efdd',
    notificationType: 'POST_COMMENT_AUTHOR',
    created: '2023-11-21T14:21:20.306508',
    read: false,
    content: 'Test Commenter commented on your post Test Post Title',
    options: {
      user: {
        id: 'test_user_id',
        avatar: '',
        avatarBlurhash: '',
        avatarDefaultColor: '#000000',
        avatarLabel: '',
        fullName: 'Test User',
      },
      comment: {
        id: 'test_comment_id',
        text: 'This is a comment.',
      },
      post: {
        id: 'test_post_id',
        title: 'Test Post Title',
      },
    },
  },
]

describe('NotificationsOverview', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    useLoginStateMock.mockImplementation(loggedIn)
    mockUseNotifications.mockReturnValue({
      notifications: [],
      isLoading: false,
      markAllNotificationsAsSeen: jest.fn(),
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('shows login message, when user is not logged in', async () => {
    useLoginStateMock.mockImplementation(loggedOut)

    render(
      <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    const notLoggedInMessage = 'loginRedirect.title'
    expect(await screen.findByText(notLoggedInMessage))
  })

  it('shows empty message, when no notification present', async () => {
    render(
      <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    // wait for user to be loaded
    const loaderTextContent = 'loginRedirect.title'
    await waitForElementToBeRemoved(() => screen.getByText(loaderTextContent))
    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    await waitFor(async () =>
      expect(await screen.findByTestId('notifications-overview')).toHaveTextContent(emptyNotificationsMessage)
    )
  })

  it('shows empty message, when notification is unsupported', async () => {
    render(
      <MockedProvider mocks={MOCKS_UNSUPPORTED_NOTIFICATION} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    // wait for user to be loaded
    const loaderTextContent = 'loginRedirect.title'
    await waitForElementToBeRemoved(() => screen.getByText(loaderTextContent))
    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    await waitFor(async () =>
      expect(await screen.findByTestId('notifications-overview')).toHaveTextContent(emptyNotificationsMessage)
    )
  })

  it('does not show an empty message when notifications present', async () => {
    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByText(/loginRedirect.title/i))

    const emptyNotificationsMessage = 'notifications.display.empty.text2'
    expect(await screen.findByTestId('notifications-overview')).not.toHaveTextContent(emptyNotificationsMessage)
  })

  it('renders a PostCommentMention, a Release notification and SpaceConnection', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: novuNotifications,
      isLoading: false,
      markAllNotificationsAsSeen: jest.fn(),
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    // wait for user to be loaded
    const loaderTextContent = 'loginRedirect.title'
    await waitForElementToBeRemoved(() => screen.getByText(loaderTextContent))

    expect(await screen.findAllByTestId('post-comment'))
    expect(await screen.findByTestId('release-info'))
    expect(await screen.findByTestId('space-post'))
    expect(await screen.findByTestId('space-connection'))
  })

  it('lists notifications in groups based on created date', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-04-11'))

    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    expect(await screen.findByText('notifications.created.thisWeek'))
    expect(await screen.findByText('notifications.created.older'))
  })

  it('reports notifications as seen', () => {
    const mockMarkAllNotificationsAsSeen = jest.fn()
    mockUseNotifications.mockReturnValue({
      notifications: novuNotifications,
      isLoading: false,
      markAllNotificationsAsSeen: mockMarkAllNotificationsAsSeen,
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    // TODO: check that LastSeenNotificationMutation is called
    expect(mockMarkAllNotificationsAsSeen).toHaveBeenCalled()
  })

  it('displays loading indicator while notifications are initializing', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      isLoading: true,
      markAllNotificationsAsSeen: jest.fn(),
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(
      <MockedProvider mocks={MOCKS_WITH_NOTIFICATIONS} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    expect(await screen.findByTestId('loader'))
  })

  it('fetches more on scroll', async () => {
    const mockFetchNextPage = jest.fn()
    mockUseNotifications.mockReturnValue({
      notifications: novuNotifications,
      isLoading: false,
      markAllNotificationsAsSeen: jest.fn(),
      canFetchMore: true,
      fetchNextPage: mockFetchNextPage,
    })

    render(
      <MockedProvider mocks={MOCKS_EMPTY} addTypename={false}>
        <Notifications />
      </MockedProvider>
    )

    expect(await screen.findByTestId('fetch-more-loader'))
    await waitFor(() => expect(mockFetchNextPage).toHaveBeenCalled())
  })
})
