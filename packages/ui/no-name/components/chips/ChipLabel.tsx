import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import Spacing from '@holi/ui/foundations/Spacing'
import { pill } from '@holi/ui/no-name/components/chips/styles'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

import { ChipSize, chipSizeToTextSize } from './size'

type ChipColor = Color | 'white'

type ChipLabelProps = {
  children?: string
  color?: ChipColor
  size?: ChipSize
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
}

const ChipLabel = ({ children, color = 'mono', size = 'md', iconLeading, iconTrailing }: ChipLabelProps) => {
  const { styles, theme } = useStyles(stylesheet, { size })
  const iconSize = size === 'sm' ? 12 : 16

  return (
    <View style={styles.chip(color)}>
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

export default ChipLabel

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
