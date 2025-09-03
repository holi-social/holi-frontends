import type { NextPage } from 'next'
import React from 'react'

import CompletedTask from '@holi/core/screens/spaces/tasks/CompletedTask'

const CompletedTaskPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <CompletedTask />
)

export default CompletedTaskPage
