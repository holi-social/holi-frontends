import React, { memo, useCallback } from 'react'

import createParamHooks, {
  arrayParamConfig,
  singleParamConfig,
  webReplaceQueryConfig,
} from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import FilteredSpaces from '@holi/core/screens/spaces/filter/components/FilteredSpaces'

export type FilteredSpacesPageParams = {
  location?: string
  topic?: string[]
  skill?: string[]
}

const { useParam, useUpdateParams } = createParamHooks<FilteredSpacesPageParams>()

const FilteredSpacesPage = () => {
  const [locationId] = useParam('location', singleParamConfig)
  const [topicSlugs] = useParam('topic', arrayParamConfig)
  const [skillSlugs] = useParam('skill', arrayParamConfig)

  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { navigate } = useRouting()

  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      if (!filters.topicSlugs.length && !filters.skillSlugs.length && !filters.location) {
        navigate('/spaces')
      } else {
        updateParams({
          topic: filters.topicSlugs,
          location: filters.location?.id,
          skill: filters.skillSlugs,
        })
      }
    },
    [updateParams, navigate]
  )

  return (
    <FilteredSpaces
      locationId={locationId}
      topicSlugs={topicSlugs}
      skillSlugs={skillSlugs}
      applyFilters={applyFilters}
    />
  )
}

export default memo(FilteredSpacesPage)
