import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SearchContent from '@holi/core/screens/search/components/SearchContent'
import { Search } from '@holi/core/screens/search/typesense/Search'

const SearchScreen = () => {
  const { t } = useTranslation()
  const title = t('search.title')
  const useTypesenseSearch = useFeatureFlagToggle(FeatureFlagKey.TYPESENSE_SEARCH)

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title, headerTitleAlign: 'center' })
  }, [setScreenOptions, title])

  const searchComponent = useTypesenseSearch ? <Search /> : <SearchContent />

  return <KeyboardAvoidingViewWrapper renderProp={() => searchComponent} />
}

export default memo(SearchScreen)
