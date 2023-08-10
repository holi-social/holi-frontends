import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { FeatureTogglesResponse, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'

const FeatureTogglesFetcher = () => {
  const { loading, error, data, refetch } = useQuery<FeatureTogglesResponse>(featureTogglesQuery)

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

  useEffect(() => {
    if (error) {
      logError(error, `[FeatureTogglesFetcher.tsx] ${error.message}`)
      return
    }
  }, [loading, data, error])

  return null
}

export default withProfiler(FeatureTogglesFetcher, { name: 'FeatureTogglesFetcher' })
