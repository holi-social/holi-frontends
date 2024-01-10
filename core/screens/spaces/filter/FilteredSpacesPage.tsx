import React, { memo, useCallback } from 'react'

import createParam, {
  arrayParamConfig,
  singleParamConfig,
  webReplaceQueryConfig,
} from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import FilteredSpaces from '@holi/core/screens/spaces/filter/components/FilteredSpaces'

export type FilteredSpacesPageParams = {
  topic?: string
  location?: string
  skill?: string[]
}

const { useParam, useUpdateParams } = createParam<FilteredSpacesPageParams>()

const FilteredSpacesPage = () => {
  const [topicSlug] = useParam('topic', singleParamConfig)
  const [locationId] = useParam('location', singleParamConfig)
  const [skillSlugs] = useParam('skill', arrayParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { navigate } = useRouting()

  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      if (!filters.topicSlug && !filters.locationId && !filters.skillSlugs?.length) {
        navigate('/spaces')
      } else {
        updateParams({
          topic: filters.topicSlug,
          location: filters.locationId,
          skill: filters.skillSlugs,
        })
      }
    },
    [updateParams, navigate]
  )

  const filters = { topicSlug, locationId, skillSlugs }

  return <FilteredSpaces {...filters} applyFilters={applyFilters} />
}

export default memo(FilteredSpacesPage)
