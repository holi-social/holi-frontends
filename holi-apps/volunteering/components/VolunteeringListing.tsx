import { useQuery } from '@apollo/client'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'

import '@holi-apps/goodnews/queries'
import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

import VolunteeringEngagementComponent from './VolunteeringEngagementComponent'

type VolunteeringListingProps = Record<string, never>

const VolunteeringListing: React.VFC<VolunteeringListingProps> = () => {
  const { loading, error, data } = useQuery<VolunteeringEngagementsQueryResponse>(VolunteeringEngagementsQuery)
  const engagements = data?.appVolunteering_engagements

  if (error) {
    logError(error, `[VolunteeringListing.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  return (
    <>
      {
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        engagements!.map((engagement: VolunteeringEngagement) => (
          <VolunteeringEngagementComponent engagement={engagement} key={engagement.id} />
        ))
      }
    </>
  )
}

export default VolunteeringListing
