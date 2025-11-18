import { getGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import { useGuestMode } from '@holi/core/screens/onboarding/hooks/useGuestMode'
import { act, renderHook } from '@testing-library/react-native'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const mockGetGuestMode = getGuestMode as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/guestModeStorage', () => ({
  getGuestMode: jest.fn(),
}))

const mockUseLoggedInUser = useLoggedInUser as jest.Mock
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

describe('useGuestMode', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: false, isLoading: false })
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return guest mode and loading state', async () => {
    mockGetGuestMode.mockResolvedValue(true)
    const { result } = renderHook(() => useGuestMode())

    expect(result.current.guestMode).toBe(false)
    expect(result.current.isLoading).toBe(true)

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.guestMode).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('should fetch guest mode', async () => {
    mockGetGuestMode.mockResolvedValue(false)
    renderHook(() => useGuestMode())

    expect(mockGetGuestMode).toHaveBeenCalled()

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should refetch guest mode when login state changes', async () => {
    mockGetGuestMode.mockResolvedValue(true)
    const { result, rerender } = renderHook(() => useGuestMode())

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.guestMode).toBe(true)
    expect(mockGetGuestMode).toHaveBeenCalledTimes(1)

    // Simulate login
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true, isLoading: false })
    mockGetGuestMode.mockResolvedValue(false)

    rerender({})
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.guestMode).toBe(false)
    expect(mockGetGuestMode).toHaveBeenCalledTimes(2)
  })
})
