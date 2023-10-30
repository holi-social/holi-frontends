/* eslint-disable no-console */
import { renderHook, waitFor } from '@testing-library/react-native'

import { aMessage, aMessageListPage } from '@holi/core/screens/notifications/components/novu/testData'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
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

  it.only('should fetch and return notifications initially', async () => {
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
})

function aNotificationsResponse(notificationId: string, notificationContent: string, notificationCreated: string) {
  return aMessageListPage(aMessage(notificationId, notificationContent, notificationCreated))
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
