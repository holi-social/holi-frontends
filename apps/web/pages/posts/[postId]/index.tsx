import { NextPage, NextPageContext } from 'next'
import React from 'react'

import PostDetailPage from '@holi/core/screens/posts/PostDetailPage'
import { PostById } from '@holi/core/screens/posts/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const PostPage: NextPage = () => <PostDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { postId: originalPostId } = context.query
  const postId = coerceToUUIDString(originalPostId)

  const queries = [
    {
      query: PostById,
      variables: {
        id: postId,
      },
      skip: !postId,
    },
  ]

  return createServerSideProps(context, queries)
}

export default PostPage
