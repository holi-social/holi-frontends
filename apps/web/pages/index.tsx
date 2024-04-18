import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import HomeFeedOnboarding from '@holi/core/screens/homeFeed/HomeFeedOnboarding'
import { POSTS_PAGE_SIZE } from '@holi/core/screens/homeFeed/components/InspirationPosts'
import { inspirationPostsQuery } from '@holi/core/screens/homeFeed/queries'
import { INSIGHT_PAGE_SIZE } from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

import { PROJECT_PAGE_SIZE } from '@holi-apps/donations/components/DonationUpdates'
import { donationProjectsQuery } from '@holi-apps/donations/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

const HomeFeedPage: NextPage = () => <HomeFeedOnboarding />

export const getServerSideProps = async (context: NextPageContext) => {
  const { location } = context.query

  const queries = [
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
  ]

  return createServerSideProps(context, queries)
}

export default HomeFeedPage
