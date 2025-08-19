import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const MyBadges = dynamic(() => import('@holi/core/screens/userprofile/MyBadges'), {
  ssr: false,
})
const MyBadgesPage: NextPage = () => <MyBadges />

export default MyBadgesPage
