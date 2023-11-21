import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export interface HoliRoundedSectionProps {
  style?: StyleProp<ViewStyle>
  testID?: string
  first?: boolean
}

const HoliRoundedSection = ({ children, style, testID, first }: PropsWithChildren<HoliRoundedSectionProps>) => {
  return (
    <View testID={testID} style={[styles.container, ...[first ? styles.first : []], style]}>
      {children}
    </View>
  )
}

export default HoliRoundedSection

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    borderRadius: 32,
    backgroundColor: colors.background10,
  },
  first: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
})
