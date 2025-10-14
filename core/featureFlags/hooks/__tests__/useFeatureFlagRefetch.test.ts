import { renderHook } from '@testing-library/react-hooks'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'

import { useFeatureFlagRefetch } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch'
import { useLoginState } from '@holi/core/auth/loginState'

const mockUsePosthogCrossPlatform = jest.mocked(usePosthogCrossPlatform)
jest.mock('@holi/core/tracking/PosthogCrossPlatform', () => ({
  usePosthogCrossPlatform: jest.fn(),
}))

const mockUseLoginState = jest.mocked(useLoginState)
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
}))

describe('useFeatureFlagRefetch', () => {
  const mockIdentify = jest.fn()
  const mockReloadFeatureFlags = jest.fn()
  const mockDistinctId = jest.fn()

  beforeEach(() => {
    mockUsePosthogCrossPlatform.mockReturnValue({
      optedIn: jest.fn(),
      optIn: jest.fn(),
      optOut: jest.fn(),
      reset: jest.fn(),
      flush: jest.fn(),
      capture: jest.fn(),
      distinctId: mockDistinctId,
      updatePersonProperties: jest.fn(),
      identify: mockIdentify,
      reloadFeatureFlags: mockReloadFeatureFlags,
    })
  })

  it('should identify and reload feature flags for logged in user', () => {
    mockUseLoginState.mockReturnValue({
      isLoggedIn: true,
      isLoggedOut: false,
      isUnknown: false,
      userId: '123',
    })

    const { result } = renderHook(() => useFeatureFlagRefetch())

    result.current()

    expect(mockIdentify).toHaveBeenCalledWith('123')
    expect(mockReloadFeatureFlags).toHaveBeenCalled()
  })

  it('should reload feature flags for logged out user', () => {
    mockDistinctId.mockReturnValue('posthogId')
    mockUseLoginState.mockReturnValue({
      isLoggedIn: false,
      isLoggedOut: true,
      isUnknown: false,
    })

    const { result } = renderHook(() => useFeatureFlagRefetch())

    result.current()

    expect(mockIdentify).toHaveBeenCalledWith('posthogId')
    expect(mockReloadFeatureFlags).toHaveBeenCalled()
  })
})
