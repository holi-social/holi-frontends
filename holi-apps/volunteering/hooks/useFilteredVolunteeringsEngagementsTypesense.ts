import { useMemo } from 'react'
import { transformTypesenseDocumentToEngagement } from '@holi-apps/volunteering/helpers/transformTypesenseDocumentToEngagement'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'

interface UseFilteredVolunteeringEngagementsTypesenseProps {
  filters: VolunteeringFilters
  loadingFilters?: boolean
  pageSize: number
}

export const useFilteredVolunteeringEngagementsTypesense = ({
  filters,
  loadingFilters = false,
  pageSize,
}: UseFilteredVolunteeringEngagementsTypesenseProps) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()

  const parameters = useMemo(() => {
    const optionalFilters = []
    if (filters.topics?.length) {
      optionalFilters.push(`topics_v2:[${filters.topics.join(',')}]`)
    }
    if (filters.skills?.length) {
      optionalFilters.push(`skills_v2:[${filters.skills.join(',')}]`)
    }
    const filterBy = ['type:volunteering']
    if (optionalFilters.length) {
      filterBy.push(`(${optionalFilters.join('||')})`)
    }
    if (filters.location) {
      const { latitude, longitude } = filters.location.coordinates || {}
      if (latitude && longitude) {
        filterBy.push(`location_lat_lng:(${latitude},${longitude},30 km)`)
      }
    }

    return {
      filter_by: filterBy.join('&&'),
      // TODO(SF) default sorting ok?
      // sort_by: sort_by_location + '_vector_distance:asc',
      per_page: pageSize,
    }
  }, [filters.location, filters.skills, filters.topics, pageSize])

  const { state, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: loadingFilters,
    onError: (error) => {
      displayError(error, 'Error retrieving filtered volunteering engagements', {
        location: 'useFilteredVolunteeringEngagementsTypesense.useTypesensePaginationQuery',
      })
    },
  })

  const engagements = useMemo(
    () => state.data.map((engagement) => transformTypesenseDocumentToEngagement(engagement, language)),
    [language, state.data]
  )

  useOnRefresh(refetch)

  return {
    isLoading: state.isLoading || loadingFilters,
    engagements,
    canFetchMore: state.canFetchMore,
    fetchNextPage,
    totalResults: state.totalResults,
  }
}
