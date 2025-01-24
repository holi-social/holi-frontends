import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import { taskByIdQuery } from '@holi/core/screens/spaces/details/queries'
import TaskDetails from '@holi/core/screens/spaces/tasks/TaskDetails'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const TaskDetailsPage: NextPage = () => <TaskDetails />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName, taskId: originalTaskId } = context.query
  const taskId = coerceToUUIDString(originalTaskId)

  const queries = [
    {
      query: taskByIdQuery,
      variables: {
        id: taskId,
      },
    },
  ]

  return createServerSideProps(context, queries, {
    urls: {
      en: `/spaces/${spaceIdOrName}/tasks/${taskId}`,
      de: `/spaces/${spaceIdOrName}/aufgaben/${taskId}`,
    },
  })
}

export default TaskDetailsPage
