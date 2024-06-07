import { NextPageContext } from 'next'
import React, { ReactElement } from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutDonationsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import { PROJECT_PAGE_SIZE } from '@holi-apps/donations/components/DonationListingContainer'
import { donationProjectsQuery } from '@holi-apps/donations/queries'
import DonationsAppHome from '@holi-apps/donations/screens/DonationsAppHome'

const DonationsAppHomePage: NextPageWithLayout = () => <DonationsAppHome />

DonationsAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const paths = {
  en: '/donations',
  de: '/spenden',
}

export const getServerSideProps = async (context: NextPageContext) => {
  const { location } = context.query

  const queries = [
    {
      query: donationProjectsQuery,
      variables: {
        offset: 0,
        limit: PROJECT_PAGE_SIZE,
        location,
      },
    },
  ]

  return createServerSideProps(context, queries, {
    seoTitle: 'seo.h1.donations',
    urls: paths,
  })
}

export default DonationsAppHomePage
