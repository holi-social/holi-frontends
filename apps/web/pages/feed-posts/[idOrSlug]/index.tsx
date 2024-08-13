import { NextPage, NextPageContext } from 'next'
import React from 'react'

import PostDetailsPage from '@holi/core/screens/individualPosts/PostDetailsPage'
import { postQuery } from '@holi/core/screens/individualPosts/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { SafeAreaProvider } from '@holi/ui/components/atoms/SafeAreaProvider'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const FeedPostPage: NextPage = () => (
  <SafeAreaProvider>
    <SpaceTermContextProvider>
      <PostDetailsPage />
    </SpaceTermContextProvider>
  </SafeAreaProvider>
)

export const getServerSideProps = async (context: NextPageContext) => {
  const { idOrSlug } = context.query

  const queries = [
    {
      query: postQuery,
      variables: {
        idOrSlug,
      },
      skip: !idOrSlug,
    },
  ]

  return createServerSideProps(context, queries)
}

export default FeedPostPage
