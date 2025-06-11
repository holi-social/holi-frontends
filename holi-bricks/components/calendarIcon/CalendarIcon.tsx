import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Text, type TextSize } from 'holi-bricks/components/text'
import { createStyleSheet } from 'holi-bricks/styles'
import { BorderRadius, type LayoutProps, layoutStyle, Spacing } from 'holi-bricks/foundations'
import type { Theme } from 'holi-bricks/foundations/colors/themes/types'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'

type CalendarIconSize = 'sm' | 'md' | 'lg'

export type CalendarIconProps = AccessibilityProps &
  LayoutProps & {
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
  ...rest
}: CalendarIconProps) => {
  const { t } = useTranslation()
  styles.useVariants({ size })
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
    <View style={[styles.wrapper(disabled), layoutStyle(rest)]} {...accessibilityProps(rest)}>
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

const styles = createStyleSheet((theme) => ({
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
    borderColor: getDarkColor(theme.colors, disabled),
    borderStyle: 'solid',
    backgroundColor: getDarkColor(theme.colors, disabled),
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
    color: getLightColor(theme.colors, disabled, colored),
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
    backgroundColor: getLightColor(theme.colors, disabled, colored),
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    flexShrink: 1,
    justifyContent: 'center',
  }),
}))

const getLightColor = (theme: Theme, disabled: boolean, colored: boolean) => {
  return disabled ? theme.decorative.greyLight : colored ? theme.decorative.yellowLight : theme.decorative.white
}

const getDarkColor = (theme: Theme, disabled: boolean) => {
  return disabled ? theme.decorative.greyDark : theme.decorative.black
}
