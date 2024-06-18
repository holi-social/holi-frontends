import { NextPage, NextPageContext } from 'next'
import React from 'react'

import SpaceAppointments from '@holi/core/screens/spaces/appointments/SpaceAppointments'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpaceAppointmentsPage: NextPage = () => <SpaceAppointments />

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

export default SpaceAppointmentsPage
