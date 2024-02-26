import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'
import { POSTS_RESULT_PAGE_SIZE } from '@holi/core/screens/spaces/updates/components/SpaceUpdatesTab'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpaceDetailsPage: NextPage = () => <SpaceDetails />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName } = context.query
  if (!spaceIdOrName) {
    return {}
  }

  const createQueries = async (client: ApolloClient<NormalizedCacheObject>) => {
    const space = await client
      .query<SpaceByIdResponse>({
        query: spaceByIdQuery,
        variables: {
          idOrName: spaceIdOrName,
        },
      })
      .then((result) => result.data.spaceById)

    return [
      {
        query: featureTogglesQuery,
      },
      {
        query: spacePostsQuery,
        variables: {
          offset: 0,
          limit: POSTS_RESULT_PAGE_SIZE,
          idOrName: spaceIdOrName,
          visibility: VisibilityFilter.ALL,
        },
        skip: !spaceIdOrName,
      },
      {
        query: appointmentsBySpaceIdQuery,
        variables: {
          spaceId: space?.id,
          statusType: APPOINTMENT_STATUS_TYPE.UPCOMING,
        },
        skip: !space?.id,
      },
    ]
  }

  return createServerSideProps(context, createQueries)
}

export default SpaceDetailsPage
