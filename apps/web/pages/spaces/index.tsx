import { NextPage, NextPageContext } from 'next'
import React from 'react'

import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { sdgsQuery, skillsQuery } from '@holi/core/screens/userprofile/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpacesPage: NextPage = () => <Spaces />

export const getServerSideProps = async (context: NextPageContext) => {
  // Headstart to reduce renderPromises in _document.getInitialProps
  const queries = [{ query: topicsQuery }, { query: skillsQuery }, { query: sdgsQuery }]

  return createServerSideProps(context, queries, { seoTitle: 'seo.h1.spaces' })
}

export default SpacesPage
