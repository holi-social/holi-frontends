import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'

import FilteredSpaces from '@holi/core/screens/spaces/filter/FilteredSpaces'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const FilteredSpacesPage: NextPage = () => <FilteredSpaces />

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  createServerSideProps(context, [], { seoTitle: 'seo.h1.spaces' })

export default FilteredSpacesPage
