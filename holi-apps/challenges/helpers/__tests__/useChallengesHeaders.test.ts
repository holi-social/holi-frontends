import { renderHook, waitFor } from '@testing-library/react-native'

import { Consent, TrackingPurpose } from '@holi/core/tracking/types'

import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'

const mockCreateAuthorizationHeaders = jest.fn()
const mockUseConsentState = jest.fn()
const mockUseAuth = jest.fn()

jest.mock('@holi/api/helpers', () => ({
  createAuthorizationHeaders: () => mockCreateAuthorizationHeaders(),
}))

jest.mock('@holi/core/tracking/TrackingInitializer', () => ({
  useConsentState: () => mockUseConsentState(),
}))

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('useChallengesHeaders', () => {
  beforeEach(() => {
    mockCreateAuthorizationHeaders.mockResolvedValue({})
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
    })
    mockUseConsentState.mockReturnValue({
      [TrackingPurpose.Analytics]: Consent.Given,
    })
  })

  it('should load auth headers if logged in', async () => {
    mockCreateAuthorizationHeaders.mockResolvedValue({
      Authorization: 'Bearer testSessionToken',
      'X-Session-Token': 'testSessionToken',
    })
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
    })

    const { result } = renderHook(() => useChallengesHeaders())

    // @ts-ignore
    await waitFor(() => expect(result.current['X-Session-Token']).not.toBeUndefined())

    expect(mockCreateAuthorizationHeaders).toHaveBeenCalled()
  })

  it('should not load auth headers if logged out', async () => {
    renderHook(() => useChallengesHeaders())

    expect(mockCreateAuthorizationHeaders).not.toHaveBeenCalled()
  })

  it('should return correct headers for logged in user', async () => {
    mockCreateAuthorizationHeaders.mockResolvedValue({
      Authorization: 'Bearer testSessionToken',
      'X-Session-Token': 'testSessionToken',
    })
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
    })
    const { result } = renderHook(() => useChallengesHeaders())

    // @ts-ignore
    await waitFor(() => expect(result.current['X-Session-Token']).not.toBeUndefined())

    expect(result.current).toEqual({
      Authorization: 'Bearer testSessionToken',
      'X-Session-Token': 'testSessionToken',
      'X-Client-Platform': 'holi',
      'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start',
      'X-Client-Platform-User-Consent': 'true',
      'X-Client-Platform-Version': '',
    })
  })

  it('should return correct headers for logged out user', async () => {
    const { result } = renderHook(() => useChallengesHeaders())

    expect(result.current).toEqual({
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

    expect(result.current).toEqual(
      expect.objectContaining({
        'X-Client-Platform-User-Consent': 'false',
      })
    )
  })
})
