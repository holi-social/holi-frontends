import { NextPage } from 'next'
import React from 'react'

import EditSpace from '@holi/core/screens/spaces/edit/EditSpace'

const EditSpacePage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <EditSpace />
)

export default EditSpacePage
