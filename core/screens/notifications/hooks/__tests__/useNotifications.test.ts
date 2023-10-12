import { HeadlessService } from '@novu/headless'
import { renderHook, waitFor } from '@testing-library/react-native'

import { NotificationType } from '@holi/core/screens/notifications/components/types'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockInitializeSession = jest.fn()
const mockFetchNotifications = jest.fn()
const mockMarkAllMessagesAsRead = jest.fn()

jest.useFakeTimers()

jest.mock('@holi/core/screens/notifications/config', () => ({
  novuApplicationIdentifier: 'testApplicationIdentifier',
}))

jest.mock('@novu/headless')

describe('useNotifications', () => {
  const subscriberId = 'testSubscriberId'
  const testSession = {}

  beforeEach(() => {
    // @ts-ignore
    jest.mocked(HeadlessService).mockImplementation(() => {
      return {
        initializeSession: mockInitializeSession,
        fetchNotifications: mockFetchNotifications,
        markAllMessagesAsRead: mockMarkAllMessagesAsRead,
      }
    })
  })

  it('should initialize the service with the subscriber id', () => {
    renderHook(() => useNotifications(subscriberId))

    expect(HeadlessService).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationIdentifier: 'testApplicationIdentifier',
        subscriberId,
      })
    )
  })

  it('should initialize the novu session', () => {
    renderHook(() => useNotifications(subscriberId))

    expect(mockInitializeSession).toHaveBeenCalled()
  })

  it('should fetch and return notifications', async () => {
    const testDate = new Date().toISOString()
    const testNotificationId = 'notificationId'
    const testContent = 'Test content'
    const testResponse = {
      data: [
        {
          createdAt: testDate,
          _id: testNotificationId,
          read: false,
          content: testContent,
        },
      ],
    }
    const expectedNotification = {
      notificationType: NotificationType.CONNECTION_ACCEPTED,
      created: testDate,
      id: testNotificationId,
      owner: expect.any(Object),
      read: false,
      options: expect.objectContaining({
        user: expect.objectContaining({
          fullName: testContent,
        }),
      }),
    }
    mockInitializeSession.mockImplementation(({ onSuccess }) => onSuccess(testSession))
    mockFetchNotifications.mockImplementation(({ onSuccess }) => setTimeout(() => onSuccess(testResponse), 0))

    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.notifications).toEqual([])

    expect(mockFetchNotifications).toHaveBeenCalled()

    await waitFor(() => expect(result.current.notifications).toEqual([expectedNotification]))
  })

  it('should expose flag if it is fetching', async () => {
    mockInitializeSession.mockImplementation(({ onSuccess }) => onSuccess(testSession))
    mockFetchNotifications.mockImplementation(({ listener }) =>
      setTimeout(() => {
        listener({ isFetching: true })
        setTimeout(() => listener({ isFetching: false }), 0)
      }, 0)
    )

    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.isFetching).toBeFalsy()

    await waitFor(() => expect(result.current.isFetching).toBeTruthy())
    await waitFor(() => expect(result.current.isFetching).toBeFalsy())
  })

  it('should mark all messages as read', () => {
    const { result } = renderHook(() => useNotifications(subscriberId))

    result.current.markAllNotificationsAsRead()

    expect(mockMarkAllMessagesAsRead).toHaveBeenCalled()
  })

  it('should not initialize the novu service and session without subscriber id', () => {
    renderHook(() => useNotifications())

    expect(HeadlessService).not.toHaveBeenCalled()
    expect(mockInitializeSession).not.toHaveBeenCalled()
  })
})
