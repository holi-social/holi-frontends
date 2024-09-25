import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { skillsQuery, topicsQuery } from '@holi/core/domain/shared/queries'
import ActHome from '@holi/core/screens/act/ActHome'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const ActPage: NextPage = () => <ActHome />

export const getServerSideProps = async (context: NextPageContext) => {
  const queries = [
    {
      query: topicsQuery,
    },
    {
      query: skillsQuery,
    },
  ]

  return createServerSideProps(context, queries)
}

export default ActPage
