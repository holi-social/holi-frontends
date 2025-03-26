import type { NextPage } from 'next'
import React from 'react'

import { createServerSideProps, type PageContext } from '@holi/web/helpers/createServerSideProps'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'

const HomeFeedPage: NextPage = () => <HomeFeed />

export const getServerSideProps = async (context: PageContext) =>
  createServerSideProps(context, [], {
    seoTitle: 'seo.h1.home',
    redirectIfNewUser: '/onboarding',
  })

export default HomeFeedPage
