import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const TestingBanner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.banner}>
      <HoliText>{t('homeFeed.testingBanner')}</HoliText>
    </View>
  )
}

export default TestingBanner

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    banner: {
      backgroundColor: theme.colors.brandColorC20,
      borderRadius: 4,
      padding: 16,
      textAlign: 'center',
    },
  })
