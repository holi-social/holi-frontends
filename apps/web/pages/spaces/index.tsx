import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { sdgsQuery, skillsQuery, topicsQuery } from '@holi/core/domain/shared/queries'
import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpacesPage: NextPage = () => <Spaces />

export const getServerSideProps = async (context: NextPageContext) => {
  // Headstart to reduce renderPromises in _document.getInitialProps
  const queries = [{ query: topicsQuery }, { query: skillsQuery }, { query: sdgsQuery }]

  return createServerSideProps(context, queries, { seoTitle: 'seo.h1.spaces' })
}

export default SpacesPage
