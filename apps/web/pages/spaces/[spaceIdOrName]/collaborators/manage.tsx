import { NextPage } from 'next'
import React from 'react'

import EditSpaceCollaborators from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'

const SpaceCollaboratorsEditPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <EditSpaceCollaborators />
)

export default SpaceCollaboratorsEditPage
