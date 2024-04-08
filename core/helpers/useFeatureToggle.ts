import { useQuery } from '@apollo/client'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { FeatureToggleStatus, FeatureTogglesResponse, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'

export enum FeatureToggleName {
  APPOINTMENTS = 'APPOINTMENTS',
  CHAT = 'CHAT',
  CHALLENGES = 'CHALLENGES',
  STORAGE = 'STORAGE',
  VIDEOCALL = 'VIDEOCALL',
  APPS_DONATIONS = 'APPS_DONATIONS',
  APPS_GOODNEWS = 'APPS_GOODNEWS',
  APPS_VOLUNTEERING = 'APPS_VOLUNTEERING',
  NOTIFICATIONS = 'NOTIFICATIONS',
  FEED_DAILY_INSPIRATION = 'FEED_DAILY_INSPIRATION',
  SEARCH = 'SEARCH',
  FAVORITES = 'FAVORITES',
  THEME_TOGGLE = 'THEME_TOGGLE',
}

export type FeatureToggleState = {
  loading: boolean
  status?: FeatureToggleStatus
  enabled?: boolean
}

export const useFeatureToggle = (name?: FeatureToggleName) => {
  const { displayError } = useErrorHandling()
  const { loading, error, data } = useQuery<FeatureTogglesResponse>(featureTogglesQuery, {
    fetchPolicy: isSSR ? 'network-only' : 'cache-first', // do not rely on cache for SSR, but answer query directly from cache for client, it will be refetched in background in handleAppStateChange
    onError: (error) => {
      displayError(error, 'Failed to load feature toggle', {
        location: 'useFeatureToggle',
        feature: name,
      })
    },
  })

  const status = data?.featureToggles.find((toggle) => toggle.name === name)?.status

  return {
    ftLoading: loading,
    ftError: error,
    ftStatus: status,
    ftEnabled: loading ? undefined : status === FeatureToggleStatus.PRODUCTION,
    ftMaintenance: loading ? undefined : status === FeatureToggleStatus.MAINTENANCE,
    ftPreview: loading ? undefined : status === FeatureToggleStatus.PREVIEW,
    ftOff: loading ? undefined : status === FeatureToggleStatus.OFF,
  }
}
