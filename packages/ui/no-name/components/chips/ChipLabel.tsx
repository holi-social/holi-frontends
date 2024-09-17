import React, { ReactNode } from 'react'
import { Platform, View, ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

type ChipColor = Color | 'white'
type Size = 'sm' | 'md' | 'lg'

type ChipLabelProps = {
  children?: ReactNode
  color?: ChipColor
  size?: Size
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
}

const ChipLabel = ({ children, color = 'mono', size = 'md', iconLeading, iconTrailing }: ChipLabelProps) => {
  const { styles } = useStyles(stylesheet, { size })
  const iconSize = size === 'sm' ? 12 : 16

  return (
    <View style={styles.chip(color)}>
      {iconLeading && <HoliIcon icon={iconLeading} size={iconSize} color={styles.text.color} />}
      {children && <HoliText style={styles.text}>{children}</HoliText>}
      {iconTrailing && <HoliIcon icon={iconTrailing} size={iconSize} color={styles.text.color} />}
    </View>
  )
}

export default ChipLabel

const stylesheet = createStyleSheet((theme) => ({
  chip: (color: ChipColor) => {
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
      color: theme.components.chipLabel.text,
      backgroundColor: theme.components.chipLabel.background[color],
      borderColor: theme.components.chipLabel.border[color],
      borderWidth: 1,
      borderRadius: 50,
      maxWidth: '100%',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          display: 'inline-flex' as ViewStyle['display'],
        },
      }),
      variants: {
        size: {
          sm: {
            paddingHorizontal: Spacing['3xs'],
          },
          md: {
            paddingHorizontal: Spacing['3xs'],
          },
          lg: {
            paddingHorizontal: 10,
          },
        },
      },
    }
  },
  text: {
    fontWeight: '400',
    color: theme.components.chipLabel.text,
    variants: {
      //  Temporary explicit styles, until new font & Text component is built
      size: {
        sm: { fontSize: 13, lineHeight: 15.6, letterSpacing: -0.104 },
        md: { fontSize: 15, lineHeight: 21, letterSpacing: -0.12 },
        lg: { fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18 },
      },
    },
  },
}))
