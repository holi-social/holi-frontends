import { renderHook } from '@testing-library/react-hooks'

import { useFeatureFlagRefetch } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch'
import { useFeatureFlagRefetch as useFeatureFlagRefetchWeb } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch.web'

const mockReloadFeatureFlagsMobile = jest.fn()
const mockIdentifyMobile = jest.fn()
jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({
    identify: () => mockIdentifyMobile(),
    reloadFeatureFlagsAsync: () => mockReloadFeatureFlagsMobile(),
  }),
}))

const mockReloadFeatureFlagsWeb = jest.fn()
const mockIdentifyWeb = jest.fn()
jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({
    identify: () => mockIdentifyWeb(),
    featureFlags: {
      reloadFeatureFlags: () => mockReloadFeatureFlagsWeb(),
    },
  }),
}))

describe('useFeatureFlagRefetch', () => {
  describe('mobile', () => {
    it('should reload feature flags', () => {
      const { result } = renderHook(() => useFeatureFlagRefetch())

      result.current()

      expect(mockReloadFeatureFlagsMobile).toHaveBeenCalled()
      expect(mockIdentifyMobile).toHaveBeenCalled()
    })
  })

  describe('web', () => {
    it('should reload feature flags', () => {
      const { result } = renderHook(() => useFeatureFlagRefetchWeb())
      result.current()

      expect(mockReloadFeatureFlagsWeb).toHaveBeenCalled()
      expect(mockIdentifyWeb).toHaveBeenCalled()
    })
  })
})
