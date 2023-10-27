/* eslint-disable no-console */
import { ApiService } from '@novu/client'
import { renderHook, waitFor } from '@testing-library/react-native'

import { NotificationType } from '@holi/core/screens/notifications/components/types'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockInitializeSession = jest.fn()
const mockGetNotificationsList = jest.fn()
const mockSetAuthorizationToken = jest.fn()
const mockMarkAllMessagesAsSeen = jest.fn()

jest.useFakeTimers()

jest.mock('@holi/core/screens/notifications/config', () => ({
  novuApplicationIdentifier: 'testApplicationIdentifier',
}))

jest.mock('@novu/client')

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

const TEST_REFETCH_INTERVAL_IN_MILLIS = 100

describe('useNotifications', () => {
  const subscriberId = 'testSubscriberId'
  const testNotificationId = 'notificationId'
  const testContent = 'Test content'
  const novuMessage = novuMessageFixture(testNotificationId, testContent)
  const expectedNotification = notificationFixture(testNotificationId, testContent)
  const testResponse = { data: [novuMessage] }
  const emptyTestResponse = { data: [] }
  const testError = new Error('test')

  beforeEach(() => {
    mockInitializeSession.mockResolvedValue({ token: 'someToken' })
    // @ts-ignore
    jest.mocked(ApiService).mockImplementation(() => ({
      initializeSession: mockInitializeSession,
      setAuthorizationToken: mockSetAuthorizationToken,
      getNotificationsList: mockGetNotificationsList,
      markAllMessagesAsSeen: mockMarkAllMessagesAsSeen,
    }))
  })

  it('should fetch and return notifications initially', async () => {
    mockGetNotificationsList.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))
  })

  it('should expose loading flag while initializing', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)

    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  })

  it('should handle error when fetching notifications failed', async () => {
    mockGetNotificationsList.mockRejectedValue(testError)

    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(result.current.notifications).toEqual([])
    expect(console.warn).toHaveBeenCalledWith(
      '[useNotifications.fetchMessages] Error fetching notifications from novu',
      testError,
      {}
    )
  })

  it('should refetch notifications', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(emptyTestResponse)
    mockGetNotificationsList.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useNotifications(subscriberId, TEST_REFETCH_INTERVAL_IN_MILLIS))

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))
  })

  it('should handle errors when refetching notifications', async () => {
    // initial fetch
    mockGetNotificationsList.mockResolvedValueOnce(emptyTestResponse)
    // failed refetch
    mockGetNotificationsList.mockRejectedValueOnce(testError)
    // successful refetch to wait for
    mockGetNotificationsList.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useNotifications(subscriberId, TEST_REFETCH_INTERVAL_IN_MILLIS))

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))

    expect(console.warn).toHaveBeenCalledWith(
      '[useNotifications.fetchMessages] Error fetching notifications from novu',
      testError,
      {}
    )
  })

  it('should cleanup the interval timer after unmount', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)

    const { unmount } = renderHook(() => useNotifications(subscriberId))

    await waitFor(() => expect(jest.getTimerCount()).toStrictEqual(1))

    unmount()

    expect(jest.getTimerCount()).toStrictEqual(0)

    jest.runOnlyPendingTimers()
  })

  it('should not initialize the novu service and session without subscriber id', () => {
    const { result } = renderHook(() => useNotifications())

    expect(ApiService).not.toHaveBeenCalled()
    expect(mockInitializeSession).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBeFalsy()
  })

  it('should mark all messages as seen', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)
    mockMarkAllMessagesAsSeen.mockResolvedValue(undefined)
    const { result } = renderHook(() => useNotifications(subscriberId))

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkAllMessagesAsSeen).toHaveBeenCalled()
  })

  it('should handle error when marking messages as seen failed', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)
    mockMarkAllMessagesAsSeen.mockRejectedValue(testError)
    const { result } = renderHook(() => useNotifications(subscriberId))

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(console.warn).toHaveBeenCalledWith(
      '[useNotifications.markAllNotificationsAsSeen] Error marking novu notifications as seen',
      testError,
      {}
    )
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
