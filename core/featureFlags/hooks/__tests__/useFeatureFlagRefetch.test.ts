import { renderHook } from '@testing-library/react-hooks'

import { useFeatureFlagRefetch } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch'
import { useFeatureFlagRefetch as useFeatureFlagRefetchWeb } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch.web'

const mockReloadFeatureFlagsMobile = jest.fn()
jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({
    reloadFeatureFlagsAsync: () => mockReloadFeatureFlagsMobile(),
  }),
}))

const mockReloadFeatureFlagsWeb = jest.fn()
jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({
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
    })
  })

  describe('web', () => {
    it('should reload feature flags', () => {
      const { result } = renderHook(() => useFeatureFlagRefetchWeb())
      result.current()

      expect(mockReloadFeatureFlagsWeb).toHaveBeenCalled()
    })
  })
})
