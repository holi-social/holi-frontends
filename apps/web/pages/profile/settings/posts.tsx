import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const MyPosts = dynamic(() => import('@holi/core/screens/userprofile/MyPosts'), {
  ssr: false,
})
const MyPostsPage: NextPage = () => <MyPosts />

export default MyPostsPage
