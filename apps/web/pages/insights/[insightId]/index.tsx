import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import InsightDetailPage from '@holi/core/screens/insights/InsightDetailPage'
import { insightById } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const InsightPage: NextPage = () => <InsightDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId: originalInsightId } = context.query
  const insightId = coerceToUUIDString(originalInsightId)

  const queries = [
    {
      query: insightById,
      variables: {
        id: insightId,
      },
      skip: !insightId,
    },
  ]

  return createServerSideProps(context, queries)
}

export default InsightPage
