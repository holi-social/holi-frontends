import { NextPage } from 'next'
import React from 'react'

import { Search } from '@holi/core/screens/search/Search'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

export const getServerSideProps = createServerSideProps

const SearchPage: NextPage = () => <Search />

export default SearchPage
