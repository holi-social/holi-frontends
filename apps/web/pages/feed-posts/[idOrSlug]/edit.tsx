import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const EditPost = dynamic(() => import('@holi/core/screens/individualPosts/EditPost'), {
  ssr: false,
})

const EditPostPage: NextPage = () => <EditPost />

export default EditPostPage
