import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useFeatureFlagRefetch } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useLoginState } from '@holi/core/auth/loginState'

const FeatureFlagsFetcher = () => {
  const refetch = useFeatureFlagRefetch()
  const loginState = useLoginState()

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refetch().catch((error: unknown) =>
          logError(error, 'Failed to refetch feature flags', { location: 'FeatureFlagsFetcher.handleAppStateChange' })
        )
      }
    }
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateListener.remove()
    }
  }, [refetch])

  useEffect(() => {
    refetch()
    // Refetch feature flags on all login state changes
  }, [refetch, loginState])

  useOnRefresh(refetch)

  return null
}

export default withProfiler(FeatureFlagsFetcher, { name: 'FeatureFlagsFetcher' })
