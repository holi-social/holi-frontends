import { getGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import { useGuestMode } from '@holi/core/screens/onboarding/hooks/useGuestMode'
import { act, renderHook } from '@testing-library/react-native'

const mockGetGuestMode = getGuestMode as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/guestModeStorage', () => ({
  getGuestMode: jest.fn(),
}))

describe('useGuestMode', () => {
  beforeEach(() => {
    jest.useFakeTimers()
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
})
