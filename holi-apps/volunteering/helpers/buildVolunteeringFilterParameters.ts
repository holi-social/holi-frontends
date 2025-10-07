import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import type { Typesense_SearchParams_Input } from '@holi/api/graphql/graphql-codegen'

export const buildVolunteeringFilterParameters = (
  filters: VolunteeringFilters,
  { excludeFilter }: { excludeFilter?: VolunteeringFilterKey } = {}
): Pick<Typesense_SearchParams_Input, 'filter_by' | 'sort_by'> => {
  const sortBy: string[] = []
  const filterBy = ['type:=[volunteering,task]']

  if (filters.topics?.length || filters.skills?.length) {
    const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding({ topics: filters.topics, skills: filters.skills })
    sortBy.push(`_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`)
  }

  if (excludeFilter !== 'topics' && filters.topics?.length) {
    filterBy.push(`topics_v2:=[${filters.topics.join(',')}]`)
  }
  if (excludeFilter !== 'skills' && filters.skills?.length) {
    filterBy.push(`skills_v2:=[${filters.skills.join(',')}]`)
  }
  if (excludeFilter !== 'commitmentLabels' && filters.commitmentLabels?.length) {
    filterBy.push(`commitment_label:=[${filters.commitmentLabels.join(',')}]`)
  }
  if (excludeFilter !== 'commitmentDurations' && filters.commitmentDurations?.length) {
    filterBy.push(`commitment_duration:=[${filters.commitmentDurations.join(',')}]`)
  }

  if (excludeFilter !== 'location' && filters.location) {
    const { latitude, longitude } = filters.location.coordinates || {}
    if (latitude && longitude) {
      filterBy.push(`location_lat_lng:(${latitude},${longitude},30 km)`)
      sortBy.push(`location_lat_lng(${latitude},${longitude},precision:5km):asc`)
    }
  }

  if (excludeFilter !== 'remote' && filters.remote) {
    // Filter for remote-only: location_type is remote AND (no location OR Germany-wide)
    filterBy.push('location_type:=[remote]')
    filterBy.push('(location:=[Bundesweit,Germany-wide] || location:="")')
  }

  return {
    filter_by: filterBy.join('&&'),
    sort_by: sortBy.join(','),
  }
}
