// import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import type { NextPage } from 'next'
import React from 'react'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { addApolloSSRState } from '@holi/core/helpers/useApolloSSRClient'
import HomeFeedOnboarding from '@holi/core/screens/homeFeed/HomeFeedOnboarding'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { featureFlag } from '@holi/web/environment'

import { donationProjectsQuery } from '@holi-apps/donations/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

const PROJECT_PAGE_SIZE = 5
const ENGAGEMENT_PAGE_SIZE = 5

const HomeFeedPage: NextPage = () => <HomeFeedOnboarding />

export const getServerSideProps = async () => {
  // TODO: We do an early return with empty page props. It still leads to
  // rendering everything on the client and should not have any performance cost
  // when we render the home site.
  if (!featureFlag.enableSSR) {
    return {
      props: {},
    }
  }

  const client = initializeApolloSSRClient()

  // TODO: investigate why lastInsightsQuery is not working for SSR with `Promise.allSettled`
  await client.query({ query: lastInsightsQuery })

  Promise.allSettled([
    client.query({
      query: donationProjectsQuery,
      variables: {
        limit: PROJECT_PAGE_SIZE,
        offset: 0,
      },
    }),
    client.query({
      query: goodNewsArticlesQuery,
      variables: {
        lastDate: undefined,
      },
    }),
    client.query({
      query: volunteeringEngagementsQuery,
      variables: {
        limit: ENGAGEMENT_PAGE_SIZE,
        offset: 0,
      },
    }),
  ])

  // * The server passes the props to the component through the Apollo cache. We
  // * can pass any other states not fetched from Apollo to the props prop.
  return addApolloSSRState(client, {
    props: {},
  })
}

export default HomeFeedPage
