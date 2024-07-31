import { withProfiler } from '@sentry/react'
import { useCallback, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const FeatureFlagsFetcher = () => {
  const refetch = useCallback(() => {
    // TODO: HOLI-9300 refetch feature flags from posthog
  }, [])

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refetch()
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
