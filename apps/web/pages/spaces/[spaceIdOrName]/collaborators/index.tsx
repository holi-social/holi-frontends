import { NextPage } from 'next'
import React from 'react'

import SpaceCollaboratorsManage from '@holi/core/screens/spaces/details/components/SpaceCollaboratorsManage'

const SpaceCollaboratorsPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <SpaceCollaboratorsManage />
)

export default SpaceCollaboratorsPage
