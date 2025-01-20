import type React from 'react'
import { memo } from 'react'

import SearchContent from '@holi/core/screens/search/components/SearchContent'
import { Search } from '@holi/core/screens/search/typesense/Search'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

const SearchScreen = () => {
  const useTypesenseSearch = useFeatureFlagToggle(FeatureFlagKey.TYPESENSE_SEARCH)
  return useTypesenseSearch ? <Search /> : <SearchContent />
}

export default memo(SearchScreen)
