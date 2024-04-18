import { NextPage } from 'next'
import React from 'react'

import EditTask from '@holi/core/screens/spaces/tasks/EditTask'

const EditTaskPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <EditTask />
)

export default EditTaskPage
