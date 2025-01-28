import type { NextPageContext } from 'next'
import React from 'react'

import { insightWithRecommendation } from '@holi/core/screens/insights/queries'
import RecommendationDetailPage from '@holi/core/screens/insights/recommendations/RecommendationDetailPage'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const RecommendationPage = () => <RecommendationDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId, recommendationId } = context.query

  const queries = [
    {
      query: insightWithRecommendation,
      variables: {
        insightId,
        recommendationId,
      },
      skip: !insightId || !recommendationId,
    },
  ]

  return createServerSideProps(context, queries, { uuidParams: [insightId, recommendationId] })
}

export default RecommendationPage
