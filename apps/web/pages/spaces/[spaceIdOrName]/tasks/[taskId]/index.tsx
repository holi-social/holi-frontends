import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import { taskByIdQuery } from '@holi/core/screens/spaces/details/queries'
import TaskDetails from '@holi/core/screens/spaces/tasks/TaskDetails'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const TaskDetailsPage: NextPage = () => <TaskDetails />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName, taskId } = context.query
  const coercedTaskId = coerceToUUIDString(taskId)

  const queries = [
    {
      query: taskByIdQuery,
      variables: {
        id: coercedTaskId,
      },
    },
  ]

  return createServerSideProps(context, queries, {
    urls: {
      en: `/spaces/${spaceIdOrName}/tasks/${coercedTaskId}`,
      de: `/spaces/${spaceIdOrName}/aufgaben/${coercedTaskId}`,
    },
  })
}

export default TaskDetailsPage
