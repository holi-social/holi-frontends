import { HeadlessService } from '@novu/headless'
import { renderHook, waitFor } from '@testing-library/react-native'

import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'

const mockInitializeSession = jest.fn()
const mockFetchNotifications = jest.fn()
const mockMarkAllMessagesAsRead = jest.fn()

jest.useFakeTimers()

jest.mock('@novu/headless')

jest.mocked(HeadlessService).mockImplementation((options) => {
  return {
    initializeSession: mockInitializeSession,
    fetchNotifications: mockFetchNotifications,
    markAllMessagesAsRead: mockMarkAllMessagesAsRead,
  }
})
describe('useNotifications', () => {
  const subscriberId = 'testSubscriberId'

  it('should initizalize the service with the subscriber id', () => {
    renderHook(() => useNotifications(subscriberId))

    expect(HeadlessService).toHaveBeenCalledWith({
      // TODO(SF) mock config
      applicationIdentifier: undefined,
      subscriberId,
    })
  })

  it('should initialize the novu session', async () => {
    renderHook(() => useNotifications(subscriberId))

    await waitFor(() => expect(mockInitializeSession).toHaveBeenCalled())
  })

  it('should fetch and return notifications', async () => {
    const testSession = {}
    mockInitializeSession.mockImplementationOnce(({ onSuccess }) => onSuccess(testSession))
    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.notifications).toEqual([])

    await waitFor(() => expect(mockFetchNotifications).toHaveBeenCalled())
    // TODO(SF) continue
  })

  it('should expose flag if it is fetching', async () => {
    const { result } = renderHook(() => useNotifications(subscriberId))

    expect(result.current.isFetching).toBeFalsy()
    // TODO(SF) continue
  })

  it('should mark all messages as read', async () => {
    const { result } = renderHook(() => useNotifications(subscriberId))

    await waitFor(() => expect(mockInitializeSession).toHaveBeenCalled())

    result.current.markAllNotificationsAsRead()

    expect(mockMarkAllMessagesAsRead).toHaveBeenCalled()
  })

  it('should not initialize the novu service and session without subscriber id', () => {
    renderHook(() => useNotifications())

    expect(HeadlessService).not.toHaveBeenCalled()
    expect(mockInitializeSession).not.toHaveBeenCalled()
  })
})
