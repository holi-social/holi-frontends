import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliNoResultsProps = {
  firstText?: string
  media?: JSX.Element
  secondText: string
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
}

const HoliNoResults: React.FC<HoliNoResultsProps> = ({ firstText, media, secondText, style, children }) => {
  const { t } = useTranslation()
  const title = firstText || t('global.noResults')

  return (
    <View style={[styles.holiNoResults, style]}>
      {media && <View style={styles.mediaContainer}>{media}</View>}
      <HoliText size="small">{title}</HoliText>
      <HoliText size="large" style={styles.secondText}>
        {secondText}
      </HoliText>
      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  )
}

export default HoliNoResults

const styles = StyleSheet.create({
  holiNoResults: {
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: colors.backgroundColor,
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
  },
  mediaContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  secondText: {
    marginTop: 16,
  },
  childrenContainer: {
    marginTop: 24,
  },
})
