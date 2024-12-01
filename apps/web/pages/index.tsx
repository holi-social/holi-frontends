import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const HomeFeedPage: NextPage = () => <HomeFeed />

// export const getServerSideProps = async (context: NextPageContext) =>
//   createServerSideProps(context, [], {
//     seoTitle: 'seo.h1.home',
//   })

export default HomeFeedPage
