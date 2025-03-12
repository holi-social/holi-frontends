import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type React from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

import VolunteeringRecosSlider from '@holi-apps/volunteering/components/VolunteeringRecosSlider'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import {
  type VolunteeringRecosQueryResponse,
  type VolunteeringRecosQueryVariables,
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

  if (loadingQueryVariables || loading) {
    return null
  }

  const { data: recos = [] } = data?.appVolunteering_engagementRecosV2 || {}
  const recosToRender = recos.slice(0, ENGAGEMENT_PAGE_SIZE)

  return <VolunteeringRecosSlider recos={recosToRender} cardWidth={cardWidth} />
}

export default withProfiler(VolunteeringRecos, { name: 'VolunteeringRecos' })
