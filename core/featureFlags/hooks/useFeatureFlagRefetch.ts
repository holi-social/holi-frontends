import { useCallback } from 'react'
import { useLoginState } from '@holi/core/auth/loginState'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'

export const useFeatureFlagRefetch = () => {
  const posthog = usePosthogCrossPlatform()
  const loginState = useLoginState()

  const refetch = useCallback(() => {
    posthog.identify('userId' in loginState ? loginState.userId : posthog.distinctId())
    return posthog.reloadFeatureFlags()
  }, [posthog, loginState])

  return refetch
}
