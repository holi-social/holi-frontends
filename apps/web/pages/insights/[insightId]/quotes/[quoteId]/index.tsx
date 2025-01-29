import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { insightWithQuoteById } from '@holi/core/screens/insights/queries'
import QuoteDetailPage from '@holi/core/screens/insights/quotes/QuoteDetailPage'
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

  return createServerSideProps(context, queries, { uuidParams: [insightId, quoteId] })
}

export default InsightQuotePage
