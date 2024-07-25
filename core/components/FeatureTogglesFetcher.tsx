import { withProfiler } from '@sentry/react'
import { useCallback, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const FeatureTogglesFetcher = () => {
  const refetch = useCallback(() => {
    // TODO: HOLI-9300 refetch feature toggles from posthog
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

export default withProfiler(FeatureTogglesFetcher, { name: 'FeatureTogglesFetcher' })
