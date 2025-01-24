import { NextPageContext } from 'next'
import React from 'react'

import DiscussionDetailPage from '@holi/core/screens/insights/discussions/DiscussionDetailPage'
import { discussionById } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const DiscussionPage = () => <DiscussionDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { discussionId: originalDiscussionId } = context.query
  const discussionId = coerceToUUIDString(originalDiscussionId)

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
