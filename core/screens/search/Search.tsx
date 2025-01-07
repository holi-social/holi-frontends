import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SearchContent from '@holi/core/screens/search/components/SearchContent'

const Search = () => {
  const { t } = useTranslation()
  const title = t('search.title')

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title, headerTitleAlign: 'center' })
  }, [setScreenOptions, title])

  return <KeyboardAvoidingViewWrapper renderProp={() => <SearchContent />} />
}

export default memo(Search)
