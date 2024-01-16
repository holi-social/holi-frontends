import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

type HoliProgressBarSize = 'small' | 'medium'

export interface HoliProgressBarProps {
  size?: HoliProgressBarSize
  testID?: string
  width: number | Animated.Value | Animated.AnimatedInterpolation<'string' | 'number'>
}

export const HoliProgressBar = ({ size = 'medium', testID, width }: HoliProgressBarProps) => {
  return (
    <View testID={testID} style={StyleSheet.flatten([barStyles.base, barStyles[size]])}>
      <Animated.View style={StyleSheet.flatten([progressStyles.base, progressStyles[size], { width }])} />
    </View>
  )
}

const barStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.background10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.background30,
    width: '100%',
  },
  medium: {
    height: 14,
  },
  small: {
    height: 6,
  },
})

const progressStyles = StyleSheet.create({
  base: {
    borderColor: colors.brandColorC30,
    borderWidth: 1,
    borderRadius: 6,
    minWidth: 12,
    backgroundColor: colors.brandColorC20,
    maxWidth: '100%',
  },
  medium: {
    height: 12,
  },
  small: {
    height: 4,
  },
})
