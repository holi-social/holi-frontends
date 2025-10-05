/* eslint-disable no-console */
import { act, renderHook, waitFor } from 'expo-router/testing-library'

import { useUnseenNotificationsCount } from '@holi/core/screens/notifications/hooks/useUnseenNotificationsCount'

const mockGetUnseenNotificationsCount = jest.fn()
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

describe('useUnseenNotificationsCount', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const testResponse = { count: 3 }
  const emptyTestResponse = { count: 0 }
  const testError = new Error('test')

  beforeEach(() => {
    mockUseNotificationService.mockReturnValue({
      novuService: {
        getUnseenCount: mockGetUnseenNotificationsCount,
      },
    })
  })

  it('should fetch and return notification count', async () => {
    mockGetUnseenNotificationsCount.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useUnseenNotificationsCount())

    expect(result.current.hasUnseenNotifications).toBeFalsy()

    await waitFor(() => expect(result.current.hasUnseenNotifications).toBeTruthy())
    expect(result.current.unseenNotificationsCount).toEqual(3)
  })

  it('should handle error when fetching notification count failed', async () => {
    mockGetUnseenNotificationsCount.mockRejectedValue(testError)

    const { result } = renderHook(() => useUnseenNotificationsCount())

    expect(result.current.hasUnseenNotifications).toBeFalsy()
    expect(result.current.unseenNotificationsCount).toEqual(0)

    await waitFor(() =>
      expect(console.warn).toHaveBeenCalledWith(
        '[useUnseenNotificationsCount.fetchUnseenNotificiationsCount] Error retrieving unseen notifications count',
        testError,
        {}
      )
    )
  })

  it('should refetch notifications', async () => {
    mockGetUnseenNotificationsCount.mockResolvedValueOnce(emptyTestResponse)
    mockGetUnseenNotificationsCount.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useUnseenNotificationsCount())

    expect(result.current.hasUnseenNotifications).toBeFalsy()
    expect(result.current.unseenNotificationsCount).toEqual(0)

    await waitFor(() => expect(result.current.hasUnseenNotifications).toBeTruthy())
    expect(result.current.unseenNotificationsCount).toEqual(3)
  })

  it('should handle errors when refetching notifications', async () => {
    // initial fetch
    mockGetUnseenNotificationsCount.mockResolvedValueOnce(emptyTestResponse)
    // failed refetch
    mockGetUnseenNotificationsCount.mockRejectedValueOnce(testError)
    // successful refetch to wait for
    mockGetUnseenNotificationsCount.mockResolvedValue(testResponse)

    const { result } = renderHook(() => useUnseenNotificationsCount())

    expect(result.current.hasUnseenNotifications).toBeFalsy()

    await waitFor(() => expect(result.current.hasUnseenNotifications).toBeTruthy())

    expect(console.warn).toHaveBeenCalledWith(
      '[useUnseenNotificationsCount.fetchUnseenNotificiationsCount] Error retrieving unseen notifications count',
      testError,
      {}
    )
  })

  it('should cleanup the interval timer after unmount', async () => {
    mockGetUnseenNotificationsCount.mockResolvedValue(emptyTestResponse)

    const { unmount } = renderHook(() => useUnseenNotificationsCount())

    await waitFor(() => expect(jest.getTimerCount()).toStrictEqual(1))

    unmount()

    expect(jest.getTimerCount()).toStrictEqual(0)

    jest.runOnlyPendingTimers()
  })
})
