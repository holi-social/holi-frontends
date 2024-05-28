import { NextPage, NextPageContext } from 'next'
import React from 'react'

import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpaceDetailsPage: NextPage = () => <SpaceDetails />

export const getServerSideProps = async (context: NextPageContext) => {
  const { spaceIdOrName } = context.query

  const queries = [
    {
      query: spaceByIdQuery,
      variables: {
        idOrName: spaceIdOrName,
      },
      skip: !spaceIdOrName,
    },
  ]

  return createServerSideProps(context, queries)
}

export default SpaceDetailsPage
