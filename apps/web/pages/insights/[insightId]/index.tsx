import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import InsightDetailPage from '@holi/core/screens/insights/InsightDetailPage'
import { insightById } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const InsightPage: NextPage = () => <InsightDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId } = context.query

  const queries = [
    {
      query: insightById,
      variables: {
        id: insightId,
      },
      skip: !insightId,
    },
  ]

  return createServerSideProps(context, queries, { uuidParams: [insightId] })
}

export default InsightPage
