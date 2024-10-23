import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { spaceRelatedSpacesQuery } from '@holi/core/screens/spaces/queries'
import RelatedSpaces from '@holi/core/screens/spaces/relatedSpaces/RelatedSpaces'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const RelatedSpacesPage: NextPage = () => <RelatedSpaces />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName } = context.query

  const queries = [
    {
      query: spaceRelatedSpacesQuery,
      variables: {
        idOrName: spaceIdOrName,
        offset: 0,
        limit: 20,
      },
      skip: !spaceIdOrName,
    },
  ]

  return createServerSideProps(context, queries)
}

export default RelatedSpacesPage
