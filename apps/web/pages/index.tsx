import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'

const HomeFeedPage: NextPage = () => <HomeFeed />

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  createServerSideProps(context, [], {
    seoTitle: 'seo.h1.home',
    redirectRouteForNewUsers: '/onboarding',
  })

export default HomeFeedPage
