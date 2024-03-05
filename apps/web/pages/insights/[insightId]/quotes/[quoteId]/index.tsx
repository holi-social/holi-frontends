import { NextPage, NextPageContext } from 'next'
import React from 'react'

import QuoteDetailPage from '@holi/core/screens/insights/components/quotes/QuoteDetailPage'
import { insightWithQuoteById } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const InsightQuotePage: NextPage = () => <QuoteDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId, quoteId } = context.query

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
