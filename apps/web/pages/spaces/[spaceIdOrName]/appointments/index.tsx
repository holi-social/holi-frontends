import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import SpaceAppointments from '@holi/core/screens/spaces/appointments/SpaceAppointments'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { SpaceByIdDocument } from '@holi/api/graphql/graphql-codegen'

const SpaceAppointmentsPage: NextPage = () => <SpaceAppointments />

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

export default SpaceAppointmentsPage
