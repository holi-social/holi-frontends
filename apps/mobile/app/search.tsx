import { Search } from '@holi/core/screens/search/Search'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { ArrowDownS } from '@holi/icons/src/generated'
import React from 'react'
import { NavigationCustomOptions } from '@holi/core/navigation/hooks/useScreenOptions/types'

export const options: NavigationCustomOptions = {
  headerShown: true,
  animation: 'slide_from_bottom',
  headerLeft: () => <HeaderBackButton icon={ArrowDownS} />,
}

export default Search
