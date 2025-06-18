import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { SpaceByIdDocument } from '@holi/api/graphql/graphql-codegen'

const SpaceDetailsPage: NextPage = () => <SpaceDetails />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { spaceIdOrName } = context.query

  const queries = [
    {
      query: SpaceByIdDocument,
      variables: {
        idOrName: spaceIdOrName,
      },
      skip: !spaceIdOrName,
    },
  ]

  return createServerSideProps(context, queries)
}

export default SpaceDetailsPage
