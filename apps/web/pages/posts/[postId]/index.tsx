import { NextPage, NextPageContext } from 'next'
import React from 'react'

import PostDetailPage from '@holi/core/screens/posts/PostDetailPage'
import { PostById } from '@holi/core/screens/posts/queries'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const PostPage: NextPage = () => <PostDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { postId, spaceIdOrName } = context.query

  const queries = [
    {
      query: PostById,
      variables: {
        id: postId,
      },
      skip: !postId,
    },
    {
      query: spaceByIdQuery,
      variables: {
        idOrName: spaceIdOrName,
      },
      skip: !spaceIdOrName,
    },
  ]

  return createServerSideProps(context, queries)
}

export default PostPage
