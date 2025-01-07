import React, { useMemo } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HoliText from '@holi/ui/components/atoms/HoliText'

type HoliProgressBarSize = 'small' | 'medium'

export interface ProgressStepsProps {
  size?: HoliProgressBarSize
  steps: number
  completedSteps: number
  percentage: number
}

export const ProgressSteps = ({ size = 'medium', completedSteps, steps, percentage }: ProgressStepsProps) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const barStyles = useMemo(() => getBarStyles(), [])
  const progressStyles = useMemo(() => getProgressStyles(theme), [theme])

  return (
    <View style={barStyles.container}>
      <View style={StyleSheet.flatten([barStyles.base, barStyles[size]])}>
        {Array.from({ length: steps }).map((_, index) => {
          const isCompleted = index < completedSteps
          const barColor = isCompleted ? theme.colors.brandC200 : theme.colors.white100
          const borderColor = isCompleted ? theme.colors.brandC300 : theme.colors.defaultBorder
          return (
            <Animated.View
              key={index}
              style={StyleSheet.flatten([
                progressStyles.base,
                progressStyles[size],
                { backgroundColor: barColor, borderColor: borderColor, flex: 1 },
              ])}
            />
          )
        })}
      </View>
      <HoliText color="gray300" size="extrasmall">
        {Math.floor(percentage)}
        {t('profile.completion.percentage')}
      </HoliText>
    </View>
  )
}

const getBarStyles = () =>
  StyleSheet.create({
    base: {
      width: '100%',
      flexDirection: 'row',
      gap: 6,
      overflow: 'hidden',
    },
    medium: {
      height: 14,
    },
    small: {
      height: 8,
    },
    container: {
      gap: 4,
    },
  })

const getProgressStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
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
