import { NextPageContext } from 'next'
import React, { ReactElement } from 'react'

import { skillsQuery, topicsQuery } from '@holi/core/domain/shared/queries'
import { geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
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

export const getServerSideProps = async (context: NextPageContext) => {
  const { geolocationId } = context.query

  const queries = [
    {
      query: topicsQuery,
    },
    {
      query: skillsQuery,
    },
    {
      query: geoPlaceDetailsQuery,
      variables: { id: geolocationId },
      skip: !geolocationId,
    },
  ]

  return createServerSideProps(context, queries, {
    seoTitle: 'seo.h1.volunteering',
    urls: paths,
  })
}

export default VolunteeringAppHomePage
