import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { useUserSpecificRecoParameters } from '@holi-apps/volunteering/hooks/useUserSpecificRecoParameters'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import type { SearchParams } from '@holi/core/typesense/types'
import { useMemo } from 'react'

interface UseVolunteeringRecoParametersOptions {
  pageSize?: number
  onGeolocationError?: (error: Error) => void
}

interface UseVolunteeringRecoParameters {
  isLoadingParameters: boolean
  parameters: SearchParams
}

export const useVolunteeringRecoParameters = ({
  pageSize,
  onGeolocationError,
}: UseVolunteeringRecoParametersOptions = {}): UseVolunteeringRecoParameters => {
  const { loading: loadingQueryVariables = false, skills, topics, geolocationId } = useUserSpecificRecoParameters()
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

export const useMicroactionRecoParameters = (pageSize: number) => {
  const parameters = useMemo(() => {
    return {
      filter_by: 'type:=[volunteering,task]',
      sort_by: '_rand():desc',
      per_page: pageSize,
    }
  }, [pageSize])

  return {
    parameters,
  }
}
