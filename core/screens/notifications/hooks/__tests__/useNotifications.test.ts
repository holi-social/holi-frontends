/* eslint-disable no-console */
import { act, renderHook, waitFor } from '@testing-library/react-native'

import { aMessage, aMessageListPage } from '@holi/core/screens/notifications/components/novu/testData'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockGetNotificationsList = jest.fn()
const mockMarkMessageAs = jest.fn()
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
        markMessageAs: mockMarkMessageAs,
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
      aMessage('n1', testContent, aDateString),
      aMessage('n2', testContent, aDateString, true),
      aMessage('n3', testContent, aDateString),
    ])
    mockGetNotificationsList.mockResolvedValue(messageResponse)
    mockMarkMessageAs.mockResolvedValue(undefined)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkMessageAs).toHaveBeenCalledWith(['n1', 'n3'], { seen: true })
  })

  it('should not mark messages as seen if there are none', async () => {
    const messageResponse = aMessageListPage([aMessage(testNotificationId, testContent, aDateString, true)])
    mockGetNotificationsList.mockResolvedValue(messageResponse)
    mockMarkMessageAs.mockResolvedValue(undefined)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(mockMarkMessageAs).not.toHaveBeenCalled()
  })

  it('should handle error when marking messages as seen failed', async () => {
    mockGetNotificationsList.mockResolvedValue(testResponse)
    mockMarkMessageAs.mockRejectedValue(testError)
    const { result } = renderHook(() => useNotifications())

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await result.current.markAllNotificationsAsSeen()

    expect(console.warn).toHaveBeenCalledWith(
      '[useNotifications.markAllNotificationsAsSeen] Error marking novu notifications as seen',
      testError,
      {
        messageIds: [testNotificationId],
      }
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
