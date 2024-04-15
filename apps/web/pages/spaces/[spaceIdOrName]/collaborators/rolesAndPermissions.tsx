import { NextPage } from 'next'
import React from 'react'

import SpaceRolesPermissions from '@holi/core/screens/spaces/details/components/SpaceRolesPermissions'

const SpaceRolesPermissionsPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <SpaceRolesPermissions />
)

export default SpaceRolesPermissionsPage
