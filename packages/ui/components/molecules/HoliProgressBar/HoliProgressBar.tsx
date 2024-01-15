import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

type HoliProgressBarVariant = 'default' | 'small'

export type HoliProgressBarProps = {
  variant?: HoliProgressBarVariant
  testID?: string
  width: number | Animated.Value | Animated.AnimatedInterpolation<'string' | 'number'>
}

const HoliProgressBar: React.FC<HoliProgressBarProps> = ({ variant = 'default', testID, width }) => {
  const isSmall = variant === 'small'
  return (
    <View testID={testID} style={[styles.bar, isSmall && styles.barSmall]}>
      <Animated.View style={[styles.progress, isSmall && styles.progressSmall, { width }]} />
    </View>
  )
}

export default HoliProgressBar

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background10,
    height: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.background30,
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
  barSmall: {
    height: 6,
  },
  progressSmall: {
    height: 4,
  },
})
