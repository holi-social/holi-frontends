import { renderHook, waitFor } from '@testing-library/react-native'

import { Consent, TrackingPurpose } from '@holi/core/tracking/types'

import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'

const mockCreateAuthorizationHeaders = jest.fn()
const mockUseConsentState = jest.fn()
const mockUseLoginState = jest.fn()
const mockPosthog = jest.fn()

jest.mock('@holi/api/helpers', () => ({
  createAuthorizationHeaders: () => mockCreateAuthorizationHeaders(),
}))

jest.mock('@holi/core/tracking/TrackingInitializer', () => ({
  useConsentState: () => mockUseConsentState(),
}))

jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: () => mockUseLoginState(),
}))

jest.mock('@holi/core/tracking/PosthogCrossPlatform', () => ({
  usePosthogCrossPlatform: () => mockPosthog(),
}))

describe('useChallengesHeaders', () => {
  beforeEach(() => {
    mockCreateAuthorizationHeaders.mockResolvedValue({})
    mockUseLoginState.mockReturnValue({
      isLoggedIn: false,
    })
    mockUseConsentState.mockReturnValue([
      {
        [TrackingPurpose.Analytics]: Consent.Given,
      },
      { loading: false },
    ])
    mockPosthog.mockReturnValue({
      distinctId: () => 'anonymous-tracking-id-1234',
    })
  })

  it('should load auth headers if logged in', async () => {
    mockCreateAuthorizationHeaders.mockResolvedValue({
      Authorization: 'Bearer testSessionToken',
      'X-Session-Token': 'testSessionToken',
    })
    mockUseLoginState.mockReturnValue({
      isLoggedIn: true,
    })

    const { result } = renderHook(() => useChallengesHeaders())

    // @ts-ignore
    await waitFor(() => expect(result.current['X-Session-Token']).toBe('testSessionToken'))
  })

  it('should not load auth headers if logged out', async () => {
    const { result } = renderHook(() => useChallengesHeaders())

    // @ts-ignore
    await waitFor(() => expect(result.current['X-Session-Token']).toBeUndefined())

    expect(mockCreateAuthorizationHeaders).not.toHaveBeenCalled()
  })

  it('should load anonymous tracking id, if not signed in and consent given', async () => {
    mockUseConsentState.mockReturnValue([
      {
        [TrackingPurpose.Analytics]: Consent.Given,
      },
      { loading: false },
    ])
    const { result } = renderHook(() => useChallengesHeaders())

    expect(result.current).toEqual(
      expect.objectContaining({
        'X-Client-Platform-User-Consent': 'true',
        'X-Client-Platform-Anonymous-Tracking-Id': 'anonymous-tracking-id-1234',
      })
    )
  })

  it('should not load anonymous tracking id, if signed in and consent given', async () => {
    mockCreateAuthorizationHeaders.mockResolvedValue({
      Authorization: 'Bearer testSessionToken',
      'X-Session-Token': 'testSessionToken',
    })
    mockUseLoginState.mockReturnValue({
      isLoggedIn: true,
    })
    mockUseConsentState.mockReturnValue([
      {
        [TrackingPurpose.Analytics]: Consent.Given,
      },
      { loading: false },
    ])

    const { result } = renderHook(() => useChallengesHeaders())

    await waitFor(() =>
      expect(result.current).toEqual(
        expect.not.objectContaining({
          'X-Client-Platform-Anonymous-Tracking-Id': 'anonymous-tracking-id-1234',
        })
      )
    )
  })

  it('should respect tracking consent', async () => {
    mockUseConsentState.mockReturnValue([
      {
        [TrackingPurpose.Analytics]: Consent.Denied,
      },
      { loading: false },
    ])
    const { result } = renderHook(() => useChallengesHeaders())

    expect(result.current).toEqual(
      expect.objectContaining({
        'X-Client-Platform-User-Consent': 'false',
      })
    )

    expect(result.current).toEqual(
      expect.not.objectContaining({
        'X-Client-Platform-Anonymous-Tracking-Id': 'anonymous-tracking-id-1234',
      })
    )
  })
})
