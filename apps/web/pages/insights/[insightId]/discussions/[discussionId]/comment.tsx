import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const DiscussionCommentPage = dynamic(() => import('@holi/core/screens/insights/discussions/DiscussionCommentPage'), {
  ssr: false,
})

const CommentPage: NextPage = () => <DiscussionCommentPage />

export default CommentPage
