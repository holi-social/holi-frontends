import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { insightWithQuoteById } from '@holi/core/screens/insights/queries'
import QuoteDetailPage from '@holi/core/screens/insights/quotes/QuoteDetailPage'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const InsightQuotePage: NextPage = () => <QuoteDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId: originalInsightId, quoteId: originalQuoteId } = context.query
  const insightId = coerceToUUIDString(originalInsightId)
  const quoteId = coerceToUUIDString(originalQuoteId)

  const queries = [
    {
      query: insightWithQuoteById,
      variables: {
        insightId,
        quoteId,
      },
      skip: !insightId || !quoteId,
    },
  ]

  return createServerSideProps(context, queries)
}

export default InsightQuotePage
