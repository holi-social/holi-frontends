import { NextPage, NextPageContext } from 'next'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import PostDetailsPage from '@holi/core/screens/individualPosts/PostDetailsPage'
import { postQuery } from '@holi/core/screens/individualPosts/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const FeedPostPage: NextPage = () => (
  <SafeAreaProvider>
    <PostDetailsPage />
  </SafeAreaProvider>
)

export const getServerSideProps = async (context: NextPageContext) => {
  const { slug } = context.query

  const queries = [
    {
      query: postQuery,
      variables: {
        idOrSlug: slug,
      },
      skip: !slug,
    },
  ]

  return createServerSideProps(context, queries)
}

export default FeedPostPage
