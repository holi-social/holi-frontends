import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { useVolunteeringRecosParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useMemo } from 'react'
import type { SearchParams } from 'typesense/lib/Typesense/Documents'

interface UseVolunteeringRecoTypesenseParametersOptions {
  pageSize?: number
  onGeolocationError?: (error: Error) => void
}

interface UseVolunteeringRecoTypesenseParameters {
  isLoadingParameters: boolean
  parameters: SearchParams
}

export const useVolunteeringRecoTypesenseParameters = ({
  pageSize,
  onGeolocationError,
}: UseVolunteeringRecoTypesenseParametersOptions = {}): UseVolunteeringRecoTypesenseParameters => {
  const { loading: loadingQueryVariables = false, skills, topics, geolocationId } = useVolunteeringRecosParameters()
  const { geolocationDetails, loadingGeolocation } = useGeolocationDetails(geolocationId, onGeolocationError)
  const parameters = useMemo(() => {
    const { lat, lon } = geolocationDetails?.geolocation?.properties ?? {}
    const sort_by_location = lat && lon ? `location_lat_lng(${lat}, ${lon}):asc,` : ''

    const userEmbedding = buildTopicsAndSkillsEmbedding({ topics, skills })

    return {
      filter_by: 'type:=[volunteering,task]',
      sort_by: sort_by_location + '_vector_distance:asc',
      per_page: pageSize,
      vector_query: `topics_skills_embedding_v2:(${JSON.stringify(userEmbedding)},k:100,alpha:0.9,distance_threshold:1)`,
    }
  }, [geolocationDetails?.geolocation?.properties, pageSize, skills, topics])

  return {
    isLoadingParameters: loadingQueryVariables || loadingGeolocation,
    parameters,
  }
}
