/* eslint-disable no-console */
import { act, renderHook, waitFor } from '@testing-library/react-native'

import { aMessage, aMessageListPage } from '@holi/core/screens/notifications/components/novu/testData'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockGetNotificationsList = jest.fn()
const mockMarkAllMessagesAsSeen = jest.fn()
const mockUseNotificationService = jest.fn()

jest.useFakeTimers()

jest.mock('@holi/core/screens/notifications/config', () => ({
  novuApplicationIdentifier: 'testApplicationIdentifier',
  notificationPollingInterval: 100,
}))

jest.mock('@holi/core/screens/notifications/hooks/useNotificationService', () => ({
  useNotificationService: () => mockUseNotificationService(),
}))

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('useNotifications', () => {
  const aDateString = new Date().toISOString()
  const testNotificationId = 'notificationId'
  const testContent = 'Test content'
  const expectedNotification = aNotification(testNotificationId, testContent, aDateString)
  const testResponse = aNotificationsResponse(testNotificationId, testContent, aDateString)
  const longTestResponse = aLongNotificationsResponse(testContent, aDateString)
  const emptyTestResponse = { data: [] }
  const testError = new Error('test')

  beforeEach(() => {
    mockUseNotificationService.mockReturnValue({
      novuService: {
        getNotificationsList: mockGetNotificationsList,
        markAllMessagesAsSeen: mockMarkAllMessagesAsSeen,
      },
      isInitializing: false,
    })
  })

  it('should fetch and return notifications initially', async () => {
    mockGetNotificationsList.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useNotifications())

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))
  })

  it('should expose loading flag while initializing', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)

    const { result } = renderHook(() => useNotifications())

    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  })

  it('should handle error when fetching notifications failed', async () => {
    mockGetNotificationsList.mockRejectedValue(testError)

    const { result } = renderHook(() => useNotifications())

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

    const { result } = renderHook(() => useNotifications())

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

    const { result } = renderHook(() => useNotifications())

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

    const { unmount } = renderHook(() => useNotifications())

    await waitFor(() => expect(jest.getTimerCount()).toStrictEqual(1))

    unmount()

    expect(jest.getTimerCount()).toStrictEqual(0)

    jest.runOnlyPendingTimers()
  })

  it('should mark all messages as seen', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)
    mockMarkAllMessagesAsSeen.mockResolvedValue(undefined)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkAllMessagesAsSeen).toHaveBeenCalled()
  })

  it('should handle error when marking messages as seen failed', async () => {
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)
    mockMarkAllMessagesAsSeen.mockRejectedValue(testError)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(console.warn).toHaveBeenCalledWith(
      '[useNotifications.markAllNotificationsAsSeen] Error marking novu notifications as seen',
      testError,
      {}
    )
  })

  it('should expose a flag if more messages can be fetched', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(longTestResponse)
    mockGetNotificationsList.mockResolvedValue(testResponse)
    const { result } = renderHook(() => useNotifications())

    expect(result.current.canFetchMore).toBeTruthy()

    await act(() => result.current.fetchNextPage())

    expect(result.current.canFetchMore).toBeFalsy()
  })

  it('should fetch more pages and update message list', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(longTestResponse)
    mockGetNotificationsList.mockResolvedValue(testResponse)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(10))

    await act(() => result.current.fetchNextPage())

    expect(result.current.notifications.length).toEqual(11)

    // Could be more due to refreshes
    expect(mockGetNotificationsList.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(mockGetNotificationsList).toHaveBeenCalledWith(0, { limit: 10 })
    expect(mockGetNotificationsList).toHaveBeenCalledWith(1, { limit: 10 })
  })

  it('should ignore duplicate messages', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(longTestResponse)
    mockGetNotificationsList.mockResolvedValue(longTestResponse)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(10))

    await act(() => result.current.fetchNextPage())

    expect(result.current.notifications.length).toEqual(10)
  })

  it('should update existing messages', async () => {
    const updatedContent = 'new content'
    const newTestResponse = aNotificationsResponse(testNotificationId, updatedContent, aDateString)
    mockGetNotificationsList.mockResolvedValueOnce(testResponse)
    mockGetNotificationsList.mockResolvedValue(newTestResponse)

    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(1))
    expect((result.current.notifications[0] as NotificationSpaceConnection).options.requestMessage).toEqual(testContent)

    await waitFor(() =>
      expect((result.current.notifications[0] as NotificationSpaceConnection).options.requestMessage).toEqual(
        updatedContent
      )
    )
    expect(result.current.notifications.length).toEqual(1)
  })
})

function aNotificationsResponse(notificationId: string, notificationContent: string, notificationCreated: string) {
  return aMessageListPage([aMessage(notificationId, notificationContent, notificationCreated)])
}

function aLongNotificationsResponse(notificationContent: string, notificationCreated: string) {
  return aMessageListPage(
    Array.from({ length: 10 }, (_, index) => aMessage(index.toString(), notificationContent, notificationCreated)),
    { hasMore: true }
  )
}

function aNotification(id: string, content: string, created: string) {
  return {
    notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
    created: created,
    id: id,
    read: false,
    options: expect.objectContaining({
      requestMessage: content,
    }),
  }
}
