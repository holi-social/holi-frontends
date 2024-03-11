import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import { SPACES_GROUP_LIMIT } from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { discoverSpacesQuery } from '@holi/core/screens/spaces/discover/queries'
import { getDefaultTopics } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { sdgsQuery, topicsQuery } from '@holi/core/screens/spaces/queries'
import { TopicsQueryResult, skillsQuery } from '@holi/core/screens/userprofile/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpacesPage: NextPage = () => <Spaces />

export const getServerSideProps = async (context: NextPageContext) => {
  const createQueries = async (client: ApolloClient<NormalizedCacheObject>) => {
    const topics = await client
      .query<TopicsQueryResult>({ query: topicsQuery })
      .then((result) => result.data.topics?.data.slice() || [])

    const defaultTopics = getDefaultTopics(topics, []).slice(0, 2)

    const queries = [
      { query: featureTogglesQuery }, // Search icon in header
      { query: skillsQuery },
      { query: sdgsQuery },
      ...defaultTopics.map((topic) => {
        return {
          query: discoverSpacesQuery,
          variables: {
            topicIds: [topic.id],
            limit: SPACES_GROUP_LIMIT,
            offset: 0,
          },
        }
      }),
    ]

    return queries
  }

  return createServerSideProps(context, createQueries)
}

export default SpacesPage
