import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useFeatureFlagRefetch } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch'

const FeatureFlagsFetcher = () => {
  const refetch = useFeatureFlagRefetch()

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refetch().catch((error) =>
          logError(error, 'Failed to refetch feature flags', { location: 'FeatureFlagsFetcher.handleAppStateChange' })
        )
      }
    }
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateListener.remove()
    }
  }, [refetch])

  return null
}

export default withProfiler(FeatureFlagsFetcher, { name: 'FeatureFlagsFetcher' })
