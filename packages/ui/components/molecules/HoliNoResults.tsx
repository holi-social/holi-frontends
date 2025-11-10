import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliNoResultsProps = {
  firstText?: string
  media?: React.ReactElement
  secondText: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliNoResults = ({
  firstText,
  media,
  secondText,
  style,
  children,
  testID,
}: React.PropsWithChildren<HoliNoResultsProps>) => {
  const { t } = useTranslation()
  const title = firstText || t('global.noResults')
  const { theme } = useTheme()
  const styles = React.useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.holiNoResults, style]} testID={testID}>
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    holiNoResults: {
      alignItems: 'center',
      borderRadius: 16,
      paddingVertical: 40,
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background10,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    mediaContainer: {
      alignItems: 'center',
      paddingBottom: 24,
    },
    secondText: {
      marginTop: 16,
      textAlign: 'center',
    },
    childrenContainer: {
      marginTop: 24,
    },
  })
