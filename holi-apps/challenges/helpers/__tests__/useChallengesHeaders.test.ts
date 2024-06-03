import { renderHook, waitFor } from '@testing-library/react-native'

import { Consent, TrackingPurpose } from '@holi/core/tracking/types'

import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'

const mockCreateAuthorizationHeaders = jest.fn()
const mockUseConsentState = jest.fn()

jest.mock('@holi/api/helpers', () => ({
  createAuthorizationHeaders: () => mockCreateAuthorizationHeaders(),
}))

jest.mock('@holi/core/tracking/TrackingInitializer', () => ({
  useConsentState: () => mockUseConsentState(),
}))

describe('useChallengesHeaders', () => {
  beforeEach(() => {
    mockCreateAuthorizationHeaders.mockResolvedValue({
      'X-Session-Token': 'testSessionToken',
    })
    mockUseConsentState.mockReturnValue({
      [TrackingPurpose.Analytics]: Consent.Given,
    })
  })

  it('should return undefined until auth headers are loaded', async () => {
    const { result } = renderHook(() => useChallengesHeaders())
    expect(result.current).toBeUndefined()

    // Await pending promises
    await waitFor(() => expect(result.current).not.toBeUndefined())
  })

  it('should load auth headers', async () => {
    const { result } = renderHook(() => useChallengesHeaders())

    await waitFor(() => expect(result.current).not.toBeUndefined())

    expect(mockCreateAuthorizationHeaders).toHaveBeenCalled()
  })

  it('should return correct headers', async () => {
    const { result } = renderHook(() => useChallengesHeaders())

    await waitFor(() => expect(result.current).not.toBeUndefined())

    expect(result.current).toEqual({
      'X-Session-Token': 'testSessionToken',
      'X-Client-Platform': 'holi',
      'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start',
      'X-Client-Platform-User-Consent': 'true',
      'X-Client-Platform-Version': '',
    })
  })

  it('should respect tracking consent', async () => {
    mockUseConsentState.mockReturnValue({
      [TrackingPurpose.Analytics]: Consent.Denied,
    })
    const { result } = renderHook(() => useChallengesHeaders())

    await waitFor(() => expect(result.current).not.toBeUndefined())

    expect(result.current).toEqual(
      expect.objectContaining({
        'X-Client-Platform-User-Consent': 'false',
      })
    )
  })
})
