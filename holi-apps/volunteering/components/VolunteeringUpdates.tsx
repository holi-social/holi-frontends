import { QueryHookOptions, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import VolunteeringUpdatesList from '@holi-apps/volunteering/components/VolunteeringUpdatesList'
import { VolunteeringEngagementsQueryResponse, volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

export const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringUpdatesProps = {
  locationQuery?: string
  cardWidth: number
}

const VolunteeringUpdates: React.FC<VolunteeringUpdatesProps> = ({ cardWidth }: VolunteeringUpdatesProps) => {
  const queryOptions: QueryHookOptions = {
    variables: {
      offset: 0,
      limit: ENGAGEMENT_PAGE_SIZE,
    },
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringUpdates.VolunteeringEngagementsQuery',
      }),
  }
  const { data, loading, refetch } = useQuery<VolunteeringEngagementsQueryResponse>(
    volunteeringEngagementsQuery,
    queryOptions
  )
  useOnRefresh(refetch)
  const reloading = useRefetchOnClientSideForLoggedInWebUser(volunteeringEngagementsQuery, queryOptions)

  const { data: engagements = [] } = data?.appVolunteering_engagementOpportunities || {}

  const engagementsToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  return (
    <VolunteeringUpdatesList cardWidth={cardWidth} engagements={engagementsToRender} loading={loading || reloading} />
  )
}

export default withProfiler(VolunteeringUpdates, { name: 'VolunteeringUpdates' })
