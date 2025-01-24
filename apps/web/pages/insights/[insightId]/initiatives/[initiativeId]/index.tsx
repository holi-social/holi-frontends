import type { NextPageContext } from 'next'
import React from 'react'

import InitiativeDetailPage from '@holi/core/screens/insights/initiatives/InitiativeDetailPage'
import { insightWithInitiative } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { coerceToUUIDString } from '@holi/core/helpers'

const InitiativePage = () => <InitiativeDetailPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const { insightId: originalInsightId, initiativeId: originalInitiativeId } = context.query
  const insightId = coerceToUUIDString(originalInsightId)
  const initiativeId = coerceToUUIDString(originalInitiativeId)

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

  return createServerSideProps(context, queries)
}

export default InitiativePage
