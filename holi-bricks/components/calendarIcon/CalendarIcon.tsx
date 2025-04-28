import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Text, type TextSize } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { createStyleSheet } from 'holi-bricks/utils'
import type { UnistylesTheme } from 'react-native-unistyles'

type CalendarIconSize = 'sm' | 'md' | 'lg'

export type CalendarIconProps = {
  day: number
  month: number
  disabled?: boolean
  size?: CalendarIconSize
  colored?: boolean
}

export const CalendarIcon = ({
  day,
  month,
  disabled = false,
  size = 'md',
  colored = true,
}: React.PropsWithChildren<CalendarIconProps>) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet, { size })
  const textSizes: Record<CalendarIconSize, TextSize> = {
    sm: 'lg',
    md: 'xl',
    lg: '3xl',
  }

  const getMonthName = (month: number): string => {
    const monthNames = t('monthNames', { returnObjects: true }) as string[]
    return monthNames[month - 1]?.substring(0, 3).toUpperCase() || ''
  }

  return (
    <View style={styles.wrapper(disabled)}>
      <View style={styles.month(disabled, colored)}>
        <Text size="xs" colorOverride={styles.month(disabled, colored).color}>
          {getMonthName(month)}
        </Text>
      </View>
      <View style={styles.day(disabled, colored)}>
        <Text size={textSizes[size]}>{day}</Text>
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  wrapper: (disabled: boolean) => ({
    variants: {
      size: {
        lg: {
          width: 60,
          height: 60,
          borderRadius: BorderRadius.xs,
        },
        md: {
          width: Spacing['xxl'],
          height: Spacing['xxl'],
          borderRadius: BorderRadius.xxs,
        },
        sm: {
          width: Spacing.xl,
          height: Spacing.xl,
          borderRadius: BorderRadius.xxs,
        },
      },
    },
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Spacing['3xs'],
    borderColor: getDarkColor(theme, disabled),
    borderStyle: 'solid',
    backgroundColor: getDarkColor(theme, disabled),
  }),
  month: (disabled: boolean, colored: boolean) => ({
    variants: {
      size: {
        lg: {
          width: Spacing['4xl'],
          height: Spacing.md,
        },
        md: {
          width: Spacing.xxl,
          height: Spacing.md,
        },
        sm: {
          width: Spacing.xl,
          height: Spacing.sm,
        },
      },
    },
    paddingHorizontal: Spacing['5xs'],
    textAlign: 'center',
    color: getLightColor(theme, disabled, colored),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  }),
  day: (disabled: boolean, colored: boolean) => ({
    alignItems: 'center',
    variants: {
      size: {
        lg: {
          width: 60,
          height: Spacing.xl,
        },
        md: {
          width: Spacing.xxl,
          height: Spacing.lg,
        },
        sm: {
          width: Spacing.xl,
          height: Spacing.md,
        },
      },
    },
    backgroundColor: getLightColor(theme, disabled, colored),
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    flexShrink: 1,
    justifyContent: 'center',
  }),
}))

const getLightColor = (theme: UnistylesTheme, disabled: boolean, colored: boolean) => {
  return disabled
    ? theme.colors.decorative.greyLight
    : colored
      ? theme.colors.decorative.yellowLight
      : theme.colors.decorative.white
}

const getDarkColor = (theme: UnistylesTheme, disabled: boolean) => {
  return disabled ? theme.colors.decorative.greyDark : theme.colors.decorative.black
}
