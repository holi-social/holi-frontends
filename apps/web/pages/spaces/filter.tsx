import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
import FilteredSpaces from '@holi/core/screens/spaces/filter/FilteredSpaces'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const FilteredSpacesPage: NextPage = () => <FilteredSpaces />

export const getServerSideProps = async (context: NextPageContext) => {
  const { location } = context.query

  const queries = [
    {
      query: geoPlaceDetailsQuery,
      variables: { id: location },
      skip: !location,
    },
  ]

  return createServerSideProps(context, queries, { seoTitle: 'seo.h1.spaces' })
}

export default FilteredSpacesPage
