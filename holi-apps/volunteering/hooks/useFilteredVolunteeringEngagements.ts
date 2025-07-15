import { useMemo } from 'react'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'

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

    if (filters.topics?.length) {
      filterBy.push(`topics_v2:=[${filters.topics.join(',')}]`)
    }
    if (filters.skills?.length) {
      filterBy.push(`skills_v2:=[${filters.skills.join(',')}]`)
    }
    if (filters.commitmentLabels?.length) {
      filterBy.push(`commitment_label:=[${filters.commitmentLabels.join(',')}]`)
    }
    if (filters.commitmentDurations?.length) {
      filterBy.push(`commitment_duration:=[${filters.commitmentDurations.join(',')}]`)
    }

    if (filters.location) {
      const { latitude, longitude } = filters.location.coordinates || {}
      if (latitude && longitude) {
        filterBy.push(`location_lat_lng:(${latitude},${longitude},30 km)`)
        sortBy.push(`location_lat_lng(${latitude},${longitude},precision:5km):asc`)
      }
    }

    return {
      filter_by: filterBy.join('&&'),
      sort_by: sortBy.join(','),
      per_page: pageSize,
      facet_by: 'topics_v2,skills_v2,commitment_label,commitment_duration',
    }
  }, [
    filters.commitmentDurations,
    filters.commitmentLabels,
    filters.location,
    filters.skills,
    filters.topics,
    pageSize,
  ])

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
    facetCounts: state.facetCounts,
  }
}
