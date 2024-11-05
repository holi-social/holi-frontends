import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SearchContent from '@holi/core/screens/search/components/SearchContent'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
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
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeArea style={styles.wrapper}>
          <SearchContent />
        </SafeArea>
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
