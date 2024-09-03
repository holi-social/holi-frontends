import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import { topicsQuery } from '@holi/core/domain/shared/queries'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const HomeFeedPage: NextPage = () => <HomeFeed />

export const getServerSideProps = async (context: NextPageContext) => {
  const queries = [
    {
      query: topicsQuery,
    },
  ]

  return createServerSideProps(context, queries, {
    seoTitle: 'seo.h1.home',
  })
}
export default HomeFeedPage
