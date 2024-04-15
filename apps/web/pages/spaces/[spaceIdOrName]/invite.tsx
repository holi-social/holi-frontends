import { NextPage } from 'next'
import React from 'react'

import SpaceInvite from '@holi/core/screens/spaces/details/components/SpaceInvitePage'

const SpaceInvitePage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <SpaceInvite />
)

export default SpaceInvitePage
