import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const MySpaces = dynamic(() => import('@holi/core/screens/userprofile/MySpaces'), {
  ssr: false,
})
const MySpacesPage: NextPage = () => <MySpaces />

export default MySpacesPage
