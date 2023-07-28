import { useQuery } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { withProfiler } from '@sentry/react'
import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { FeatureTogglesResponse, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'

export const FEATURE_TOGGLES_STORAGE_NAME = 'feature_toggles'

const FeatureTogglesFetcher = () => {
  const { loading, error, data, refetch } = useQuery<FeatureTogglesResponse>(featureTogglesQuery)

  const storeFeatureToggles = async (value: string) => {
    await AsyncStore.setItem(FEATURE_TOGGLES_STORAGE_NAME, value)
  }

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
    if (!loading && !error && data) {
      storeFeatureToggles(JSON.stringify(data.featureToggles))
    }
  }, [loading, data, error])

  return null
}

export default withProfiler(FeatureTogglesFetcher, { name: 'FeatureTogglesFetcher' })
