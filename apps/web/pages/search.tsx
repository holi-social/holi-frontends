import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const SearchScreen = dynamic(() => import('@holi/core/screens/search/SearchScreen'), { ssr: false })

const SearchPage: NextPage = () => <SearchScreen />

export default SearchPage
