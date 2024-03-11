import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SearchContent from '@holi/core/screens/search/components/SearchContent'
import { colors } from '@holi/ui/styles/globalVars'

const Search = () => {
  const { t } = useTranslation()
  const title = t('search.title')

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.SEARCH} featureNameKey={'search.title'}>
      <KeyboardAvoidingViewWrapper
        renderProp={() => (
          <SafeAreaView style={styles.wrapper}>
            <SearchContent />
          </SafeAreaView>
        )}
      />
    </FeatureToggleGuard>
  )
}

export default memo(Search)

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
})
