import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/accessibility'
import { pill } from 'holi-bricks/components/chips/styles'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import type { Color } from 'holi-bricks/tokens'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'

import { type ChipSize, chipSizeToTextSize } from './size'

type ChipColor = Color | 'white'

type ChipLabelProps = AccessibilityProps & {
  children?: string
  color?: ChipColor
  size?: ChipSize
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
}

export const ChipLabel = ({
  children,
  color = 'mono',
  size = 'md',
  iconLeading,
  iconTrailing,
  ...rest
}: ChipLabelProps) => {
  const { styles, theme } = useStyles(stylesheet, { size })
  const iconSize = size === 'sm' ? 12 : 16

  return (
    <View {...accessibilityProps(rest)} style={styles.chip(color)}>
      {iconLeading && <HoliIcon icon={iconLeading} size={iconSize} color={theme.components.chipLabel.text} />}
      {children && (
        <Text size={chipSizeToTextSize[size]} color={theme.components.chipLabel.text}>
          {children}
        </Text>
      )}
      {iconTrailing && <HoliIcon icon={iconTrailing} size={iconSize} color={theme.components.chipLabel.text} />}
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
