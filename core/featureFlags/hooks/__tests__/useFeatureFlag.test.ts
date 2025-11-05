import { renderHook } from '@testing-library/react-native'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { useFeatureFlag as useFeatureFlagWeb } from '@holi/core/featureFlags/hooks/useFeatureFlag.web'

const mockUseFeatureFlagWithPayload = jest.fn()
jest.mock('posthog-react-native', () => ({
  useFeatureFlagWithPayload: (flag: string) => mockUseFeatureFlagWithPayload(flag),
}))

const mockUseFeatureFlagVariantKey = jest.fn()
const mockUseFeatureFlagPayload = jest.fn()
const mockBootstrappedFeatureFlag = jest.fn()
const mockBootstrappedFeatureFlagPayload = jest.fn()
jest.mock('posthog-js/react', () => ({
  useFeatureFlagVariantKey: (flag: string) => mockUseFeatureFlagVariantKey(flag),
  useFeatureFlagPayload: (flag: string) => mockUseFeatureFlagPayload(flag),
  usePostHog: () => ({
    featureFlags: {
      getFeatureFlag: (flag: string) => mockBootstrappedFeatureFlag(flag),
      getFeatureFlagPayload: (flag: string) => mockBootstrappedFeatureFlagPayload(flag),
    },
  }),
}))

describe('useFeatureFlag', () => {
  const flag = FeatureFlagKey.DONATIONS
  const state = 'on'
  const payload = { foo: 'bar' }

  describe('mobile', () => {
    it('should return state and payload for flag', () => {
      mockUseFeatureFlagWithPayload.mockReturnValue([state, payload])

      const { result } = renderHook(() => useFeatureFlag(flag))

      expect(result.current).toEqual([state, payload])
      expect(mockUseFeatureFlagWithPayload).toHaveBeenCalledWith(flag)
    })
  })

  describe('web', () => {
    it('should fetch state and payload for flag', () => {
      renderHook(() => useFeatureFlagWeb(flag))

      expect(mockUseFeatureFlagVariantKey).toHaveBeenCalledWith(flag)
      expect(mockUseFeatureFlagPayload).toHaveBeenCalledWith(flag)
      expect(mockBootstrappedFeatureFlag).toHaveBeenCalledWith(flag)
      expect(mockBootstrappedFeatureFlagPayload).toHaveBeenCalledWith(flag)
    })

    it('should return state and payload for flag', () => {
      mockBootstrappedFeatureFlag.mockReturnValue('off')
      mockBootstrappedFeatureFlagPayload.mockReturnValue(null)
      mockUseFeatureFlagVariantKey.mockReturnValue(state)
      mockUseFeatureFlagPayload.mockReturnValue(payload)

      const { result } = renderHook(() => useFeatureFlagWeb(flag))

      expect(result.current).toEqual([state, payload])
    })

    it('should use bootstrapped values as fallback when main state is null/unavilable', () => {
      const fallbackState = 'off'
      const fallbackPayload = { bar: 'baz' }

      mockUseFeatureFlagVariantKey.mockReturnValue(null)
      mockUseFeatureFlagPayload.mockReturnValue(null)
      mockBootstrappedFeatureFlag.mockReturnValue(fallbackState)
      mockBootstrappedFeatureFlagPayload.mockReturnValue(fallbackPayload)

      const { result } = renderHook(() => useFeatureFlagWeb(flag))

      expect(result.current).toEqual([fallbackState, fallbackPayload])
    })
  })
})
