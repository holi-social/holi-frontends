import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextPageContext } from 'next'
import pino from 'pino'
import React, { ReactElement } from 'react'

import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringListing'
import { volunteeringCategoriesQuery, volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'
import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'

const logger = pino()

const VolunteeringAppHomePage: NextPageWithLayout = () => <VolunteeringAppHome />

VolunteeringAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const getServerSideProps = async (context: NextPageContext) => {
  const { location, category } = context.query

  const createQueries = async (client: ApolloClient<NormalizedCacheObject>) => {
    const geolocation =
      location &&
      (await client
        .query<GeoPlaceDetailsResponse>({
          query: geoPlaceDetailsQuery,
          variables: {
            id: location,
          },
        })
        .then((result) => result.data.geo_placeDetails)
        .catch((error) => {
          logger.error({
            message: `Error retrieving geolocation for id ${location}`,
            error,
          })
          return undefined
        }))

    return [
      {
        query: volunteeringEngagementsQuery,
        variables: {
          offset: 0,
          limit: ENGAGEMENT_PAGE_SIZE,
          location: geolocation,
          category,
        },
        skip: !!location && !geolocation,
      },
      {
        query: volunteeringCategoriesQuery,
      },
    ]
  }

  return createServerSideProps(context, createQueries, {
    seoTitle: 'seo.h1.volunteering',
    urls: {
      en: '/volunteering',
      de: '/ehrenamt',
    },
  })
}

export default VolunteeringAppHomePage
