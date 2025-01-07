import React, { useMemo } from 'react'
import { Animated, DimensionValue, StyleSheet, View } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type HoliProgressBarSize = 'small' | 'medium'

export interface HoliProgressBarProps {
  size?: HoliProgressBarSize
  testID?: string
  percentage: number | Animated.Value | Animated.AnimatedInterpolation<'string' | 'number'>
}

export const HoliProgressBar = ({ size = 'medium', testID, percentage }: HoliProgressBarProps) => {
  const { theme } = useTheme()
  const barStyles = useMemo(() => getBarStyles(theme), [theme])
  const progressStyles = useMemo(() => getProgressStyles(theme), [theme])
  const width: DimensionValue = typeof percentage === 'number' ? `${percentage}%` : percentage

  return (
    <View testID={testID} style={StyleSheet.flatten([barStyles.base, barStyles[size]])}>
      <Animated.View style={StyleSheet.flatten([progressStyles.base, progressStyles[size], { width }])} />
    </View>
  )
}

const getBarStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      backgroundColor: theme.colors.white100,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.black300at12percent,
      width: '100%',
    },
    medium: {
      height: 14,
    },
    small: {
      height: 8,
    },
  })

const getProgressStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      borderColor: theme.colors.brandC300,
      borderWidth: 1,
      borderRadius: 6,
      minWidth: 12,
      backgroundColor: theme.colors.brandC200,
      maxWidth: '100%',
    },
    medium: {
      height: 12,
    },
    small: {
      height: 6,
    },
  })
