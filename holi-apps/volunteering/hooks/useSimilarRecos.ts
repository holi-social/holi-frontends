import { QueryResult, useQuery } from '@apollo/client'
import { MAX_RECOS_COUNT } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import {
  VolunteeringSimilarRecosQueryResponse,
  VolunteeringSimilarRecosQueryVariables,
  volunteeringSimilarRecosQuery,
} from '@holi-apps/volunteering/queries'
import { logError } from '@holi/core/errors/helpers'

export function useSimilarRecos(
  engagementId: string
): QueryResult<VolunteeringSimilarRecosQueryResponse, VolunteeringSimilarRecosQueryVariables> {
  return useQuery(volunteeringSimilarRecosQuery, {
    variables: { id: engagementId, offset: 0, limit: MAX_RECOS_COUNT },
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringRecos.volunteeringRecosQuery',
      }),
  })
}
