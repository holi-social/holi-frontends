import type React from 'react'
import { memo } from 'react'

import SearchContent from '@holi/core/screens/search/components/SearchContent'
import { Search } from '@holi/core/screens/search/typesense/Search'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

const SearchScreen = () => {
  const useTypesenseSearch = useFeatureFlagToggle(FeatureFlagKey.TYPESENSE_SEARCH)

  if (useTypesenseSearch === undefined /* loading */) {
    return <HoliLoader />
  }

  return useTypesenseSearch ? <Search /> : <SearchContent />
}

export default memo(SearchScreen)
