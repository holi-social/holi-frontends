import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SearchContent from '@holi/core/screens/search/components/SearchContent'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const Search = () => {
  const { t } = useTranslation()
  const title = t('search.title')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
      flex: 1,
      ...Platform.select({
        web: {
          minHeight: '100%',
        },
      }),
    },
  })
