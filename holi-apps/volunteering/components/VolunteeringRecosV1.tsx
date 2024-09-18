import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import VolunteeringUpdatesList from '@holi-apps/volunteering/components/VolunteeringUpdatesList'
import { useVolunteeringRecosV1QueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosV1QueryVariables'
import {
  VolunteeringRecosV1QueryResponse,
  VolunteeringRecosV1QueryVariables,
  volunteeringRecosV1Query,
} from '@holi-apps/volunteering/queries'

export const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringRecosV1Props = {
  cardWidth: number
}

const VolunteeringRecosV1: React.FC<VolunteeringRecosV1Props> = ({ cardWidth }: VolunteeringRecosV1Props) => {
  const { queryVariables, loading: loadingQueryVariables = false } = useVolunteeringRecosV1QueryVariables()

  const { data, loading, refetch } = useQuery<VolunteeringRecosV1QueryResponse, VolunteeringRecosV1QueryVariables>(
    volunteeringRecosV1Query,
    {
      variables: { ...queryVariables, offset: 0, limit: ENGAGEMENT_PAGE_SIZE },
      skip: loadingQueryVariables,
      onError: (error) =>
        logError(error, 'Failed to load volunteering engagements', {
          location: 'VolunteeringRecosV1.VolunteeringEngagementsQuery',
        }),
    }
  )
  useOnRefresh(refetch)
  const reloading = useRefetchOnClientSideForLoggedInWebUser(volunteeringRecosV1Query, {
    variables: queryVariables,
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringRecosV1.VolunteeringEngagementsQuery',
      }),
  })

  const { data: engagements = [] } = data?.appVolunteering_engagementRecommendations || {}

  const engagementsToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  return (
    <VolunteeringUpdatesList
      engagements={engagementsToRender}
      loading={loading || reloading || loadingQueryVariables}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(VolunteeringRecosV1, { name: 'VolunteeringRecosV1' })
