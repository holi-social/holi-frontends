import type { NextPage } from 'next'
import React from 'react'

import HomeFeedOnboarding from '@holi/core/screens/homeFeed/HomeFeedOnboarding'

// const PROJECT_PAGE_SIZE = 5
// const ENGAGEMENT_PAGE_SIZE = 5

const HomeFeedPage: NextPage = () => <HomeFeedOnboarding />

// TODO: update SSR implementation
// export const getServerSideProps = async (context: NextPageContext) => {
//   return createServerSideProps(context, [
//     // TODO: investigate why lastInsightsQuery is not working for SSR with `Promise.allSettled`
//     { query: lastInsightsQuery },
//     {
//       query: donationProjectsQuery,
//       variables: {
//         limit: PROJECT_PAGE_SIZE,
//         offset: 0,
//       },
//     },
//     {
//       query: goodNewsArticlesQuery,
//       variables: {
//         lastDate: undefined,
//       },
//     },
//     {
//       query: volunteeringEngagementsQuery,
//       variables: {
//         limit: ENGAGEMENT_PAGE_SIZE,
//         offset: 0,
//       },
//     }
//   ])
// }

export default HomeFeedPage
