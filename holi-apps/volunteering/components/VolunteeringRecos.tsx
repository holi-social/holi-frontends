import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import VolunteeringRecosList from '@holi-apps/volunteering/components/VolunteeringRecosList'
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
  const { queryVariables, loading: loadingQueryVariables } = useVolunteeringRecosQueryVariables()

  const { data, loading, refetch } = useQuery<VolunteeringRecosQueryResponse, VolunteeringRecosQueryVariables>(
    volunteeringRecosQuery,
    {
      variables: { ...queryVariables, offset: 0, limit: ENGAGEMENT_PAGE_SIZE },
      skip: loadingQueryVariables,
      onError: (error) =>
        logError(error, 'Failed to load volunteering engagements', {
          location: 'VolunteeringRecos.volunteeringRecosQuery',
        }),
    }
  )
  useOnRefresh(refetch)
  const reloading = useRefetchOnClientSideForLoggedInWebUser(volunteeringRecosQuery, {
    variables: queryVariables,
    onError: (error) =>
      logError(error, 'Failed to reload volunteering engagements', {
        location: 'VolunteeringRecos.volunteeringRecosQuery/reload',
      }),
  })

  if (loadingQueryVariables || loading || reloading) {
    return null
  }

  const { data: recos = [] } = data?.appVolunteering_engagementRecos || {}
  const recosToRender = recos.slice(0, ENGAGEMENT_PAGE_SIZE)

  return <VolunteeringRecosList recos={recosToRender} cardWidth={cardWidth} />
}

export default withProfiler(VolunteeringRecos, { name: 'VolunteeringRecos' })
