import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import VolunteeringUpdatesList from '@holi-apps/volunteering/components/VolunteeringUpdatesList'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import {
  VolunteeringRecosQueryResponse,
  VolunteeringRecosQueryVariables,
  volunteeringRecosQuery,
} from '@holi-apps/volunteering/queries'

export const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringRecosProps = {
  cardWidth: number
}

const VolunteeringRecos: React.FC<VolunteeringRecosProps> = ({ cardWidth }: VolunteeringRecosProps) => {
  const { queryVariables, loading: loadingQueryVariables = false } = useVolunteeringRecosQueryVariables()

  const { data, loading, refetch } = useQuery<VolunteeringRecosQueryResponse, VolunteeringRecosQueryVariables>(
    volunteeringRecosQuery,
    {
      variables: { ...queryVariables, offset: 0, limit: ENGAGEMENT_PAGE_SIZE },
      skip: loadingQueryVariables,
      onError: (error) =>
        logError(error, 'Failed to load volunteering engagements', {
          location: 'VolunteeringRecos.VolunteeringEngagementsQuery',
        }),
    }
  )
  useOnRefresh(refetch)
  const reloading = useRefetchOnClientSideForLoggedInWebUser(volunteeringRecosQuery, {
    variables: queryVariables,
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringRecos.VolunteeringEngagementsQuery',
      }),
  })

  const { data: engagements = [] } = data?.appVolunteering_engagementRecos || {}

  const engagementsToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  return (
    <VolunteeringUpdatesList
      engagements={engagementsToRender}
      loading={loading || reloading || loadingQueryVariables}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(VolunteeringRecos, { name: 'VolunteeringRecos' })
