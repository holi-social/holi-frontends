/* eslint-disable no-console */
import { act, renderHook, waitFor } from '@testing-library/react-native'

import { aMessage, aMessageListPage } from '@holi/core/screens/notifications/components/novu/testData'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockGetNotificationsList = jest.fn()
const mockMarkAllMessagesAsSeen = jest.fn()
const mockUseNotificationService = jest.fn()

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
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const aDateString = new Date().toISOString()
  const testNotificationId = 'notificationId'
  const testMessage = 'Test message'
  const expectedNotification = aNotification(testNotificationId, testMessage, aDateString)
  const testResponse = aNotificationsResponse(testNotificationId, testMessage, aDateString)
  const longTestResponse = aLongNotificationsResponse(testMessage, aDateString)
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

  it('should mark all unread messages as seen', async () => {
    const messageResponse = aMessageListPage([
      aMessage('n1', testMessage, aDateString),
      aMessage('n2', testMessage, aDateString, true),
      aMessage('n3', testMessage, aDateString),
    ])
    mockGetNotificationsList.mockResolvedValue(messageResponse)
    mockMarkAllMessagesAsSeen.mockResolvedValue(undefined)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkAllMessagesAsSeen).toHaveBeenCalled()
  })

  it('should mark unread messages as seen only once per message', async () => {
    const messagePage1 = aMessageListPage(
      Array.from({ length: 10 }, (_, index) =>
        aMessage('n' + index, testMessage, aDateString, ![1, 3].includes(index))
      ),
      { hasMore: true }
    )
    const messagePage2 = aMessageListPage([aMessage('n11', testMessage, aDateString)])
    mockGetNotificationsList.mockResolvedValueOnce(messagePage1)
    mockGetNotificationsList.mockResolvedValue(messagePage2)
    mockMarkAllMessagesAsSeen.mockResolvedValue(undefined)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkAllMessagesAsSeen).toHaveBeenCalled()

    await act(() => result.current.fetchNextPage())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkAllMessagesAsSeen).toHaveBeenCalledTimes(2)
  })

  it('should handle error when marking messages as seen failed', async () => {
    mockGetNotificationsList.mockResolvedValue(testResponse)
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

  it('should expose a flag if more messages are being fetched', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(longTestResponse)
    mockGetNotificationsList.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(testResponse), 100))
    )
    const { result } = renderHook(() => useNotifications())

    expect(result.current.isFetchingMore).toBeFalsy()

    await act(async () => {
      const response = result.current.fetchNextPage()
      await waitFor(() => expect(result.current.isFetchingMore).toBeTruthy())
      return response
    })

    expect(result.current.isFetchingMore).toBeFalsy()
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

  it('should refetch messages', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(testResponse)
    mockGetNotificationsList.mockResolvedValue(longTestResponse)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(1))

    await act(() => result.current.refetch())

    await waitFor(() => expect(result.current.notifications.length).toEqual(10))
  })

  it('should replace messages during refetch', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(testResponse)
    mockGetNotificationsList.mockResolvedValue(emptyTestResponse)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(1))

    await act(() => result.current.refetch())

    await waitFor(() => expect(result.current.notifications.length).toEqual(0))
  })

  it('should handle errors during refetch and keep previous messages', async () => {
    mockGetNotificationsList.mockResolvedValueOnce(testResponse)
    mockGetNotificationsList.mockRejectedValue(testError)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(1))

    await act(() => result.current.refetch())

    await expect(result.current.notifications.length).toEqual(1)

    expect(console.warn).toHaveBeenCalledWith(
      '[useNotifications.fetchMessages] Error fetching notifications from novu',
      testError,
      {}
    )
  })

  it('should reset pagination during refetch', async () => {
    // Fetch page 1 => expect 10
    mockGetNotificationsList.mockResolvedValueOnce(longTestResponse)
    // Fetch page 2 => expect 11
    mockGetNotificationsList.mockResolvedValueOnce(testResponse)
    // Refresh, i.e. fetch page 1 again => expect 10
    mockGetNotificationsList.mockResolvedValueOnce(longTestResponse)
    // Fetch page 2 => expect 11
    mockGetNotificationsList.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.notifications.length).toEqual(10))

    await act(() => result.current.fetchNextPage())

    expect(result.current.notifications.length).toEqual(11)

    await act(() => result.current.refetch())

    expect(result.current.notifications.length).toEqual(10)

    await act(() => result.current.fetchNextPage())

    expect(result.current.notifications.length).toEqual(11)

    expect(mockGetNotificationsList).toHaveBeenCalledWith(0, { limit: 10 })
    expect(mockGetNotificationsList).toHaveBeenCalledWith(1, { limit: 10 })
    expect(mockGetNotificationsList).not.toHaveBeenCalledWith(2, { limit: 10 })
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

function aNotification(id: string, requestMessage: string, created: string) {
  return {
    notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
    notificationVersion: '1.0.0',
    created: created,
    id: id,
    read: false,
    options: expect.objectContaining({
      requestMessage,
    }),
    content: 'Some user wants to join space: ' + requestMessage,
  }
}
