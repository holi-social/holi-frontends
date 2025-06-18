import type { NextPage } from 'next'
import React from 'react'

import CreateOrEditTask from '@holi/core/screens/spaces/tasks/CreateOrEditTask'

const EditTaskPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <CreateOrEditTask />
)

export default EditTaskPage
