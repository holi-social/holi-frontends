import type { GetServerSidePropsContext } from 'next'
import React from 'react'

import InitiativeDetailPage from '@holi/core/screens/insights/initiatives/InitiativeDetailPage'
import { insightWithInitiative } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const InitiativePage = () => <InitiativeDetailPage />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { insightId, initiativeId } = context.query

  const queries = [
    {
      query: insightWithInitiative,
      variables: {
        insightId,
        initiativeId,
      },
      skip: !insightId || !initiativeId,
    },
  ]

  return createServerSideProps(context, queries, { uuidParams: [insightId, initiativeId] })
}

export default InitiativePage
