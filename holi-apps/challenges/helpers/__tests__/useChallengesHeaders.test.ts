import { renderHook, waitFor } from 'expo-router/testing-library'

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
      distinctId: () => '1234',
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
    mockUseLoginState.mockReturnValue({
      isLoggedIn: true,
    })
    const { result } = renderHook(() => useChallengesHeaders())

    // @ts-ignore
    await waitFor(() => expect(result.current['X-Session-Token']).not.toBeUndefined())

    expect(result.current).toEqual({
      Authorization: 'Bearer testSessionToken',
      'X-Session-Token': 'testSessionToken',
      'X-Client-Platform': 'holi',
      'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start, versioned-message-from-backend',
      'X-Client-Platform-User-Consent': 'true',
      'X-Client-Platform-Version': '0.0.0',
    })
  })

  it('should return correct headers for logged out user', async () => {
    const { result } = renderHook(() => useChallengesHeaders())

    expect(result.current).toEqual({
      'X-Client-Platform': 'holi',
      'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start, versioned-message-from-backend',
      'X-Client-Platform-User-Consent': 'true',
      'X-Client-Platform-Anonymous-Tracking-Id': '1234',
      'X-Client-Platform-Version': '0.0.0',
    })
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
        'X-Client-Platform-Anonymous-Tracking-Id': '1234',
      })
    )
  })
})
