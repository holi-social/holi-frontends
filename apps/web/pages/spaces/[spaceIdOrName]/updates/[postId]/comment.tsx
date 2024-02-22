import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const CommentInputPage = dynamic(() => import('@holi/core/screens/posts/CommentInputPage'), { ssr: false })

const PostPage: NextPage = () => <CommentInputPage />

export default PostPage
