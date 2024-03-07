import { NextPage } from 'next'
import React from 'react'

import PostDetailPage from '@holi/core/screens/posts/PostDetailPage'
import { getServerSideProps as postGetServerSideProps } from '@holi/web/pages/posts/[postId]'

const PostPage: NextPage = () => <PostDetailPage />

export const getServerSideProps = postGetServerSideProps

export default PostPage
