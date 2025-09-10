import type { NextPage } from 'next'
import React from 'react'

import TaskCompletionFlow from '@holi/core/screens/spaces/tasks/TaskCompletionFlow'

const TaskCompletionFlowPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <TaskCompletionFlow />
)

export default TaskCompletionFlowPage
