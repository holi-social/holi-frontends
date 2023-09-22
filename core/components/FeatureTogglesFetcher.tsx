import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { FeatureTogglesResponse, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'

const FeatureTogglesFetcher = () => {
  const { refetch } = useQuery<FeatureTogglesResponse>(featureTogglesQuery, {
    onError: (error) =>
      logError(error, 'Failed to load feature toggles', { location: 'FeatureTogglesFetcher.featureTogglesQuery' }),
  })

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
