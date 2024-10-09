import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const CreatePost = dynamic(() => import('@holi/core/screens/individualPosts/CreatePost'), {
  ssr: false,
})

const CreatePostPage: NextPage = () => <CreatePost />

export default CreatePostPage
