import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import TaskDetails from '@holi/core/screens/spaces/tasks/TaskDetails'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const TaskDetailsPage: NextPage = () => <TaskDetails />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName, taskId } = context.query

  const createQueries = async (client: ApolloClient<NormalizedCacheObject>) => {
    const space = await client
      .query<SpaceByIdResponse>({
        query: spaceByIdQuery,
        variables: {
          idOrName: spaceIdOrName,
        },
      })
      .then((result) => result.data.spaceById)

    const task = (space?.tasks || []).find((t) => t.id === taskId)
    if (!task) {
      // TODO(SF) temporary hack to handle collaborators-only tasks
      // does not properly handle "real" 404s
      // Will be fixed by HOLI-7766
      client.cache.evict({ id: client.cache.identify(space) })
    }

    return [
      {
        query: featureTogglesQuery,
      },
    ]
  }

  return createServerSideProps(context, createQueries)
}

export default TaskDetailsPage
