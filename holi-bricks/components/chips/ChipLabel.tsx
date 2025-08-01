import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { pill } from 'holi-bricks/components/chips/styles'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { IconSize, layoutStyle, Spacing, type Color, type LayoutProps } from 'holi-bricks/foundations'
import React from 'react'
import { View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { chipSizeToTextSize, type ChipSize } from './size'

export type ChipColor = Color | 'white'

export type ChipLabelProps = AccessibilityProps &
  LayoutProps & {
    children?: string
    color?: ChipColor
    size?: ChipSize
    iconLeading?: HoliIconType
    iconTrailing?: HoliIconType
    testID?: string
  }

export const ChipLabel = ({
  children,
  color = 'mono',
  size = 'md',
  iconLeading,
  iconTrailing,
  testID,
  ...rest
}: ChipLabelProps) => {
  const { styles, theme } = useStyles(stylesheet, { size })
  const iconSize = size === 'sm' ? IconSize.xs : IconSize.sm

  return (
    <View {...accessibilityProps(rest)} style={[styles.chip(color), layoutStyle(rest)]} testID={testID}>
      {iconLeading && <HoliIcon icon={iconLeading} size={iconSize} colorOverride={theme.components.chipLabel.text} />}
      {children && (
        <Text size={chipSizeToTextSize[size]} colorOverride={theme.components.chipLabel.text}>
          {children}
        </Text>
      )}
      {iconTrailing && <HoliIcon icon={iconTrailing} size={iconSize} colorOverride={theme.components.chipLabel.text} />}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  chip: (color: ChipColor) => {
    return {
      ...pill,
      color: theme.components.chipLabel.text,
      backgroundColor: theme.components.chipLabel.background[color],
      borderColor: theme.components.chipLabel.border[color],
      borderWidth: 1,
      alignSelf: 'flex-start',
      variants: {
        size: {
          sm: {
            paddingHorizontal: Spacing['3xs'],
            minHeight: Spacing.md,
          },
          md: {
            paddingHorizontal: Spacing['3xs'],
            minHeight: Spacing.lg,
          },
          lg: {
            paddingHorizontal: 10,
            minHeight: Spacing.xl,
          },
        },
      },
    }
  },
}))
