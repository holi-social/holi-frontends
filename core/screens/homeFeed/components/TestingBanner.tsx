import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

const TestingBanner: React.VFC = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.banner}>
      <HoliText>{t('homeFeed.testingBanner')}</HoliText>
    </View>
  )
}

export default TestingBanner

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.backgroundColorPillGreen,
    borderRadius: 4,
    padding: 16,
    textAlign: 'center',
  },
})
