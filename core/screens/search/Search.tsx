import React, { memo, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SearchContent from '@holi/core/screens/search/components/SearchContent'
import type { BottomTabsScreens } from '@holi/mobile/navigation/BottomTabsNavigator'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const Search: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const title = t('search.title')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const setScreenOptions = useSetScreenOptions()

  // TODO: Remove from ^1.11.0
  const { ftOff } = useFeatureToggle(FeatureToggleName.SEARCH)

  useLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  if (ftOff) navigate('/')

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <SearchContent />
        </SafeAreaView>
      )}
    />
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
