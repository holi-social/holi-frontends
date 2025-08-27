import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const MyConnections = dynamic(() => import('@holi/core/screens/userprofile/MyConnections'), {
  ssr: false,
})
const MyConnectionsPage: NextPage = () => <MyConnections />

export default MyConnectionsPage
