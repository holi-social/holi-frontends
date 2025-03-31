import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import { taskByIdQuery } from '@holi/core/screens/spaces/details/queries'
import TaskDetails from '@holi/core/screens/spaces/tasks/TaskDetails'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const TaskDetailsPage: NextPage = () => <TaskDetails />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { spaceIdOrName, taskId } = context.query

  const queries = [
    {
      query: taskByIdQuery,
      variables: {
        id: taskId,
      },
    },
  ]

  return createServerSideProps(context, queries, {
    uuidParams: [taskId],
    urls: {
      en: `/spaces/${spaceIdOrName}/tasks/${taskId}`,
      de: `/spaces/${spaceIdOrName}/aufgaben/${taskId}`,
    },
  })
}

export default TaskDetailsPage
