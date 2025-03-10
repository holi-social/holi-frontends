import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import createParamHooks, { arrayParamConfig, singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { slugsToSkillsV2, slugsToTopicsV2 } from '@holi/core/domain/shared/types'

export type FilteredSpacesPageParams = {
  location?: string
  topic?: string[]
  skill?: string[]
}

const { useParam } = createParamHooks<FilteredSpacesPageParams>()

export const useSpaceInitialFilters = () => {
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const [locationId] = useParam('location', singleParamConfig)
  const [topicParams = []] = useParam('topic', arrayParamConfig)
  const [skillParams = []] = useParam('skill', arrayParamConfig)
  const topicSlugs = slugsToTopicsV2(topicParams)
  const skillSlugs = slugsToSkillsV2(skillParams)
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
