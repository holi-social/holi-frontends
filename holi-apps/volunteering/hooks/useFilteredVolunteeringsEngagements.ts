import { useMemo } from 'react'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import { LOCATION_PRECISION, LOCATION_RADIUS } from '@holi/core/typesense/constants'

interface UseFilteredVolunteeringEngagementsProps {
  filters: VolunteeringFilters
  loadingFilters?: boolean
  pageSize: number
}

export const useFilteredVolunteeringEngagements = ({
  filters,
  loadingFilters = false,
  pageSize,
}: UseFilteredVolunteeringEngagementsProps) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()

  const parameters = useMemo(() => {
    const sortBy = []
    const filterBy = ['type:=[volunteering,task]']

    if (filters.topics?.length || filters.skills?.length) {
      const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding({ topics: filters.topics, skills: filters.skills })
      sortBy.push([`_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`])
    }

    const optionalFilters = []
    if (filters.topics?.length) {
      optionalFilters.push(`topics_v2:=[${filters.topics.join(',')}]`)
    }
    if (filters.skills?.length) {
      optionalFilters.push(`skills_v2:=[${filters.skills.join(',')}]`)
    }
    if (optionalFilters.length) {
      filterBy.push(`(${optionalFilters.join('||')})`)
    }

    if (filters.location) {
      const { latitude, longitude } = filters.location.coordinates || {}
      if (latitude && longitude) {
        filterBy.push(`location_lat_lng:(${latitude},${longitude},${LOCATION_RADIUS})`)
        sortBy.push(`location_lat_lng(${latitude},${longitude},precision:${LOCATION_PRECISION}):asc`)
      }
    }

    return {
      filter_by: filterBy.join('&&'),
      sort_by: sortBy.join(','),
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
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
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
