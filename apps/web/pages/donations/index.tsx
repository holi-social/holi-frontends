import type { GetServerSidePropsContext } from 'next'
import React, { type ReactElement } from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutDonationsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import DonationsAppHome from '@holi-apps/donations/screens/DonationsAppHome'

const DonationsAppHomePage: NextPageWithLayout = () => <DonationsAppHome />

DonationsAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const paths = {
  en: '/donations',
  de: '/spenden',
}

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  createServerSideProps(context, [], {
    seoTitle: 'seo.h1.donations',
    urls: paths,
  })

export default DonationsAppHomePage
