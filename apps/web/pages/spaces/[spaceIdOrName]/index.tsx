import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'
import { POSTS_RESULT_PAGE_SIZE } from '@holi/core/screens/spaces/updates/components/SpaceUpdatesTab'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpaceDetailsPage: NextPage = () => <SpaceDetails />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName } = context.query

  const queries = [
    {
      query: spaceByIdQuery,
      variables: {
        idOrName: spaceIdOrName,
      },
      skip: !spaceIdOrName,
    },
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
    },
  ]

  return createServerSideProps(context, queries)
}

export default SpaceDetailsPage
