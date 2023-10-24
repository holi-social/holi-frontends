import { useQuery } from '@apollo/client'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleStatus, FeatureTogglesResponse, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'

export enum FeatureToggleName {
  CHAT = 'CHAT',
  STORAGE = 'STORAGE',
  VIDEOCALL = 'VIDEOCALL',
  APPS_DONATIONS = 'APPS_DONATIONS',
  APPS_GOODNEWS = 'APPS_GOODNEWS',
  APPS_VOLUNTEERING = 'APPS_VOLUNTEERING',
  NOTIFICATIONS = 'NOTIFICATIONS',
}

export type FeatureToggleState = {
  loading: boolean
  status?: FeatureToggleStatus
  enabled?: boolean
}

export const useFeatureToggle = (name?: FeatureToggleName) => {
  const { displayError } = useErrorHandling()
  const { loading, error, data } = useQuery<FeatureTogglesResponse>(featureTogglesQuery, {
    fetchPolicy: 'cache-first', // answer query directly from cache, it will be refetched in background in handleAppStateChange
    onError: (error) => {
      displayError(error, 'Failed to load feature toggle', {
        location: 'useFeatureToggle',
        feature: name,
      })
    },
  })

  const status = data?.featureToggles.find((toggle) => toggle.name === name)?.status

  return {
    loading,
    error,
    status: status,
    enabled: loading ? undefined : status === FeatureToggleStatus.PRODUCTION,
  }
}
