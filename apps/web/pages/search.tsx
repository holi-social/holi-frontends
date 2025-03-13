import { NextPage } from 'next'
import React from 'react'

import SearchScreen from '@holi/core/screens/search/SearchScreen'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

export const getServerSideProps = createServerSideProps

const SearchPage: NextPage = () => <SearchScreen />

export default SearchPage
