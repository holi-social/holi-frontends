import { useQuery } from '@apollo/client'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleStatus, FeatureTogglesResponse, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'

export enum FeatureToggleName {
  CHAT = 'CHAT',
}

export const useFeatureToggle = (name: FeatureToggleName) => {
  const { displayError } = useErrorHandling()
  const { loading, error, data } = useQuery<FeatureTogglesResponse>(featureTogglesQuery, {
    fetchPolicy: 'cache-first', // answer query directly from cache, it will be refetched in background in handleAppStateChange
    onError: (error) => {
      displayError(error)
    },
  })

  const status = data?.featureToggles.find((toggle) => toggle.name === name)?.status

  return {
    loading,
    error,
    status: status,
    enabled: status === FeatureToggleStatus.PRODUCTION,
  }
}
