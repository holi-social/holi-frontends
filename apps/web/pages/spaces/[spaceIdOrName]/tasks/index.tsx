import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import SpaceTasks from '@holi/core/screens/spaces/tasks/SpaceTasks'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpaceTasksPage: NextPage = () => <SpaceTasks />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { spaceIdOrName } = context.query

  const queries = [
    {
      query: spaceByIdQuery,
      variables: {
        idOrName: spaceIdOrName,
      },
      skip: !spaceIdOrName,
    },
  ]

  return createServerSideProps(context, queries, {
    urls: {
      en: `/spaces/${spaceIdOrName}/tasks`,
      de: `/spaces/${spaceIdOrName}/aufgaben`,
    },
  })
}

export default SpaceTasksPage
