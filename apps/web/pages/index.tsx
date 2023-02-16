import type { NextPage } from 'next'

import { initializeApolloWebClient } from '@holi/api/graphql/client'
import { addApolloWebState } from '@holi/core/helpers/useApolloWebClient'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'

// import { projectsQuery } from '@holi-apps/donations/queries'
// import { GoodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
// import { VolunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

const HomeFeedPage: NextPage = () => <HomeFeed />

export const getServerSideProps = async () => {
  const client = initializeApolloWebClient()

  // Include missing queries to be populated in the server
  await client.query({ query: lastInsightsQuery })

  return addApolloWebState(client, {
    props: {},
  })
}

export default HomeFeedPage
