import { NextPage, NextPageContext } from 'next'
import React from 'react'

import CurationPrinciplesPage from '@holi/core/screens/insights/CurationPrinciplesPage'
import { insightAuthors } from '@holi/core/screens/insights/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const CurationPrinciples: NextPage = () => <CurationPrinciplesPage />

export const getServerSideProps = async (context: NextPageContext) => {
  const queries = [
    {
      query: insightAuthors,
      variables: {
        limit: 30,
      },
    },
  ]

  return createServerSideProps(context, queries)
}

export default CurationPrinciples
