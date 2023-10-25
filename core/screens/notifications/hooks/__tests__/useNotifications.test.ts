import { ApiService } from '@novu/client'
import { renderHook, waitFor } from '@testing-library/react-native'

import { NotificationType } from '@holi/core/screens/notifications/components/types'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockInitializeSession = jest.fn()
const mockGetNotificationsList = jest.fn()
const mockSetAuthorizationToken = jest.fn()
const mockMarkAllMessagesAsRead = jest.fn()

jest.mock('@holi/core/screens/notifications/config', () => ({
  novuApplicationIdentifier: 'testApplicationIdentifier',
}))

jest.mock('@novu/client')

describe('useNotifications', () => {
  const subscriberId = 'testSubscriberId'

  beforeEach(() => {
    // @ts-ignore
    jest.mocked(ApiService).mockImplementation(() => ({
      initializeSession: mockInitializeSession,
      setAuthorizationToken: mockSetAuthorizationToken,
      getNotificationsList: mockGetNotificationsList,
      markAllMessagesAsRead: mockMarkAllMessagesAsRead,
    }))
  })

  it('should fetch and return notifications initially', async () => {
    const testNotificationId = 'notificationId'
    const testContent = 'Test content'
    const testResponse = { data: [novuMessageFixture(testNotificationId, testContent)] }
    const expectedNotification = notificationFixture(testNotificationId, testContent)

    mockInitializeSession.mockResolvedValue({ token: 'someToken' })
    mockGetNotificationsList.mockResolvedValue(testResponse)
    mockSetAuthorizationToken.mockImplementation(() => ({}))

    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))
  })

  it('should refetch notifications', async () => {
    const TEST_REFETCH_INTERVAL_IN_MILLIS = 100

    const testNotificationId = 'notificationId'
    const testContent = 'Test content'
    const newMessage = novuMessageFixture(testNotificationId, testContent)
    const expectedNotification = notificationFixture(testNotificationId, testContent)

    mockInitializeSession.mockResolvedValue({ token: 'someToken' })
    mockGetNotificationsList.mockResolvedValueOnce({ data: [] })
    mockGetNotificationsList.mockResolvedValue({ data: [newMessage] })

    const { result } = renderHook(() => useNotifications(subscriberId, TEST_REFETCH_INTERVAL_IN_MILLIS))

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))
  })

  it('should not initialize the novu service and session without subscriber id', () => {
    renderHook(() => useNotifications())

    expect(ApiService).not.toHaveBeenCalled()
    expect(mockInitializeSession).not.toHaveBeenCalled()
  })
})

const aDate = new Date().toISOString()

function novuMessageFixture(testNotificationId: string, testContent: string) {
  return {
    createdAt: aDate,
    _id: testNotificationId,
    read: false,
    content: testContent,
  }
}

function notificationFixture(testNotificationId: string, testContent: string) {
  // todo gregor: map notifications correctly and don't just use a wrong static type
  return {
    notificationType: NotificationType.CONNECTION_ACCEPTED,
    created: aDate,
    id: testNotificationId,
    owner: expect.any(Object),
    read: false,
    options: expect.objectContaining({
      user: expect.objectContaining({
        fullName: testContent,
      }),
    }),
  }
}
