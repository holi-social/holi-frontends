import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextPage, NextPageContext } from 'next'
import pino from 'pino'
import React from 'react'

import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
import { arrayParamConfig } from '@holi/core/navigation/hooks/useParam'
import FilteredSpaces from '@holi/core/screens/spaces/filter/FilteredSpacesPage'
import { SPACES_PAGE_SIZE } from '@holi/core/screens/spaces/filter/components/FilteredSpaces'
import { spacesQuery } from '@holi/core/screens/spaces/filter/queries'
import { sdgsQuery, topicsQuery } from '@holi/core/screens/spaces/queries'
import { skillsQuery } from '@holi/core/screens/userprofile/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const FilteredSpacesPage: NextPage = () => <FilteredSpaces />
const logger = pino()

export const getServerSideProps = async (context: NextPageContext) => {
  const { topic, location, skill } = context.query
  const skillSlugs = arrayParamConfig.parse(skill)
  const topicSlugs = arrayParamConfig.parse(topic)

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
        .then((result) => result.data.geo_placeDetails.geolocation)
        .catch((error) => {
          logger.error({
            message: `Error retrieving geolocation for id ${location}`,
            error,
          })
          return undefined
        }))

    return [
      {
        query: spacesQuery,
        variables: {
          geolocation,
          topicSlugs,
          skillSlugs,
          offset: 0,
          limit: SPACES_PAGE_SIZE,
        },
      },
      { query: topicsQuery },
      { query: skillsQuery },
      { query: sdgsQuery },
    ]
  }

  return createServerSideProps(context, createQueries, { seoTitle: 'seo.h1.spaces' })
}

export default FilteredSpacesPage
