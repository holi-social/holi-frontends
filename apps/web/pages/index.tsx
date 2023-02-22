import type { NextPage } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { addApolloSSRState } from '@holi/core/helpers/useApolloSSRClient'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { featureFlag } from '@holi/web/environment'

import { projectsQuery } from '@holi-apps/donations/queries'
import { GoodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { VolunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

const PROJECT_PAGE_SIZE = 5
const ENGAGEMENT_PAGE_SIZE = 5

const HomeFeedPage: NextPage = () => <HomeFeed />

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

  // TODO: Query only what is necessary to render this page
  await client.query({ query: lastInsightsQuery })
  await client.query({
    query: projectsQuery,
    variables: {
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
    },
  })
  await client.query({
    query: GoodNewsArticlesQuery,
    variables: {
      lastDate: undefined,
    },
  })
  await client.query({
    query: VolunteeringEngagementsQuery,
    variables: {
      limit: ENGAGEMENT_PAGE_SIZE,
      offset: 0,
    },
  })

  // * The server passes the props to the component through the Apollo cache. We
  // * can pass any other states not fetched from Apollo to the props prop.
  return addApolloSSRState(client, {
    props: {},
  })
}

export default HomeFeedPage
