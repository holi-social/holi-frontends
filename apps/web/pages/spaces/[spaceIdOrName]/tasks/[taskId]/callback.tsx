import type { NextPage } from 'next'
import React from 'react'

import CompleteTaskCallback from '@holi/core/screens/spaces/tasks/CompleteTaskCallback'

const CompleteTaskCallbackPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <CompleteTaskCallback />
)

export default CompleteTaskCallbackPage
