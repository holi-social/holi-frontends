import { useVolunteeringRecosParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useMemo } from 'react'
import type { VolunteeringRecosQueryVariables } from '@holi-apps/volunteering/queries'

const buildUserEmbedding = ({ skills, topics }: VolunteeringRecosQueryVariables) => {
  const userEmbedding = [
    ...ALL_TOPICS.map((topic) => (topics?.includes(topic) ? 1 : 0)),
    ...ALL_SKILLS.map((skill) => (skills?.includes(skill) ? 1 : 0)),
  ]
  return userEmbedding
}

interface UseVolunteeringRecoTypesenseParametersOptions {
  pageSize?: number
  onGeolocationError?: (error: Error) => void
}

export const useVolunteeringRecoTypesenseParameters = ({
  pageSize,
  onGeolocationError,
}: UseVolunteeringRecoTypesenseParametersOptions = {}) => {
  const { loading: loadingQueryVariables = false, skills, topics, geolocationId } = useVolunteeringRecosParameters()
  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(geolocationId, onGeolocationError)
  const parameters = useMemo(() => {
    const { lat, lon } = geolocationDetails?.geolocation?.properties ?? {}
    const sort_by = lat && lon ? `location_lat_lng(${lat}, ${lon}):asc,` : ''

    const userEmbedding = buildUserEmbedding({ topics, skills })

    return {
      filter_by: 'type:volunteering',
      sort_by: sort_by + '_vector_distance:asc',
      per_page: pageSize,
      vector_query: `topics_skills_embedding_v2:(${JSON.stringify(userEmbedding)},k:100,alpha:0.9,distance_threshold:1)`,
      exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
    }
  }, [geolocationDetails?.geolocation?.properties, pageSize, skills, topics])

  return {
    isLoadingParameters: loadingQueryVariables || loadingGeolocation,
    parameters,
  }
}
