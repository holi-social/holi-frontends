import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import createParamHooks, { arrayParamConfig, singleParamConfig } from '@holi/core/navigation/hooks/useParam'

export type FilteredSpacesPageParams = {
  location?: string
  topic?: string[]
  skill?: string[]
}

const { useParam } = createParamHooks<FilteredSpacesPageParams>()

export const useSpaceInitialFilters = () => {
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const locationId = useParam('location', singleParamConfig)
  const topicSlugs = useParam('topic', { ...arrayParamConfig, initial: [] })
  const skillSlugs = useParam('skill', { ...arrayParamConfig, initial: [] })
  const filters = { topicSlugs, locationId, skillSlugs }

  const location = useGeolocationDetailsWithSuggestion(locationId, (error) =>
    displayError(error, 'Failed to load geolocation details', {
      displayMessage: t('spaces.spaceListing.error'),
      location: 'FilteredSpaces.useEffect',
      locationId,
    })
  )

  return {
    location,
    filters,
  }
}
