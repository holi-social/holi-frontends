import React, { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface HoliRoundedSectionProps {
  style?: StyleProp<ViewStyle>
  testID?: string
  first?: boolean
}

const HoliRoundedSection = ({ children, style, testID, first }: PropsWithChildren<HoliRoundedSectionProps>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View testID={testID} style={[styles.container, ...[first ? styles.first : []], style]}>
      {children}
    </View>
  )
}

export default HoliRoundedSection

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 24,
      borderRadius: 32,
      backgroundColor: theme.colors.background10,
    },
    first: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  })
