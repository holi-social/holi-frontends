import type { GetServerSidePropsContext } from 'next'
import React, { type ReactElement } from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'

const VolunteeringAppHomePage: NextPageWithLayout = () => <VolunteeringAppHome />

VolunteeringAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const paths = {
  en: '/volunteering',
  de: '/ehrenamt',
}

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  createServerSideProps(context, [], {
    seoTitle: 'seo.h1.volunteering',
    urls: paths,
  })

export default VolunteeringAppHomePage
