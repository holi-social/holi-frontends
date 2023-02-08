import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type HoliProgressBarProps = {
  progress: number
  isSmall?: boolean
  testID?: string
  barStyle?: StyleProp<ViewStyle>
  progressStyle?: StyleProp<ViewStyle>
}

const HoliProgressBar: React.FC<HoliProgressBarProps> = ({
  progress = 0,
  isSmall = false,
  testID,
  barStyle,
  progressStyle,
}) => {
  return (
    <View testID={testID} style={[styles.bar, barStyle, isSmall && { height: 6 }]}>
      <View style={[styles.progress, progressStyle, isSmall && { height: 6 }, { width: `${progress}%` }]} />
    </View>
  )
}

export default HoliProgressBar

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.backgroundColorWhite,
    height: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
    width: '100%',
  },
  progress: {
    borderColor: colors.brandColorC30,
    borderWidth: 1,
    borderRadius: 6,
    minWidth: 12,
    height: 12,
    backgroundColor: colors.brandColorC20,
    maxWidth: '100%',
  },
})
