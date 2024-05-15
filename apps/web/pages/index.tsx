import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import { SpaceRecommendationDocument } from '@holi/api/graphql/graphql-codegen'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import { POSTS_PAGE_SIZE } from '@holi/core/screens/homeFeed/components/InspirationPosts'
import { inspirationPostsQuery } from '@holi/core/screens/homeFeed/queries'
import { FEED_POSTS_PAGE_SIZE } from '@holi/core/screens/individualPosts/components/AllPosts'
import { feedPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { INSIGHT_PAGE_SIZE } from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

import { PROJECT_PAGE_SIZE } from '@holi-apps/donations/components/DonationUpdates'
import { donationProjectsQuery } from '@holi-apps/donations/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

const HomeFeedPage: NextPage = () => <HomeFeed />

export const getServerSideProps = async (context: NextPageContext) => {
  const { location } = context.query

  const queries = [
    {
      query: feedPostsQuery,
      variables: {
        limit: FEED_POSTS_PAGE_SIZE,
      },
    },
    {
      query: lastInsightsQuery,
      variables: {
        limit: INSIGHT_PAGE_SIZE,
      },
    },
    {
      query: inspirationPostsQuery,
      variables: {
        limit: POSTS_PAGE_SIZE,
      },
    },
    {
      query: donationProjectsQuery,
      variables: {
        offset: 0,
        limit: PROJECT_PAGE_SIZE,
        location,
      },
    },
    {
      query: goodNewsArticlesQuery,
      variables: {
        lastDate: undefined,
      },
    },
    {
      query: volunteeringEngagementsQuery,
      variables: {
        limit: ENGAGEMENT_PAGE_SIZE,
        offset: 0,
      },
    },
    {
      query: SpaceRecommendationDocument,
      variables: {
        limit: 5,
      },
    },
  ]

  return createServerSideProps(context, queries, { seoTitle: 'seo.h1.home' })
}

export default HomeFeedPage
