import type { NextPageContext } from 'next'
import React from 'react'

import { insightWithRecommendation } from '@holi/core/screens/insights/queries'
import RecommendationDetailPage from '@holi/core/screens/insights/recommendations/RecommendationDetailPage'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const RecommendationPage = () => <RecommendationDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId: originalInsightId, recommendationId: originalRecommendationId } = context.query
  const insightId = coerceToUUIDString(originalInsightId)
  const recommendationId = coerceToUUIDString(originalRecommendationId)

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

  return createServerSideProps(context, queries)
}

export default RecommendationPage
