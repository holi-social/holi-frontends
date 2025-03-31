import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import PostDetailPage from '@holi/core/screens/posts/PostDetailPage'
import { PostById } from '@holi/core/screens/posts/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const PostPage: NextPage = () => <PostDetailPage />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { postId } = context.query

  const queries = [
    {
      query: PostById,
      variables: {
        id: postId,
      },
      skip: !postId,
    },
  ]

  return createServerSideProps(context, queries, { uuidParams: [postId] })
}

export default PostPage
