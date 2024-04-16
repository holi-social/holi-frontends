import { NextPageContext } from 'next'
import React from 'react'

import DiscussionDetailPage from '@holi/core/screens/insights/discussions/DiscussionDetailPage'
import { discussionById } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const DiscussionPage = () => <DiscussionDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { discussionId } = context.query

  const queries = [
    {
      query: discussionById,
      variables: {
        discussionId,
      },
      skip: !discussionById,
    },
  ]

  return createServerSideProps(context, queries)
}

export default DiscussionPage
