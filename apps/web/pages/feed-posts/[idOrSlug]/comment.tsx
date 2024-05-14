import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const PostCommentPage = dynamic(() => import('@holi/core/screens/individualPosts/PostCommentPage'), {
  ssr: false,
})

const CommentPage: NextPage = () => <PostCommentPage />

export default CommentPage
