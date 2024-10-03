import React from 'react'
import { GestureResponderEvent, Pressable, PressableProps } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

import { pill } from './styles'

type ChipColor = Color | 'white'
type Size = 'sm' | 'md' | 'lg'

type ChipActionProps = PressableProps & {
  onPress: (event: GestureResponderEvent) => void
  children?: string
  selected?: boolean
  disabled?: boolean
  color?: ChipColor
  size?: Size
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
}

const ChipAction = ({
  onPress,
  children,
  selected = false,
  disabled = false,
  color = 'mono',
  size = 'md',
  iconLeading,
  iconTrailing,
}: ChipActionProps) => {
  const { styles } = useStyles(stylesheet, { size, selected, disabled })
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <Pressable
      role="switch"
      aria-checked={selected}
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, color)]}
    >
      {iconLeading && <HoliIcon icon={iconLeading} size={iconSize} color={styles.text.color} />}
      {children && (
        <HoliText selectable={false} style={styles.text}>
          {children}
        </HoliText>
      )}
      {iconTrailing && <HoliIcon icon={iconTrailing} size={iconSize} color={styles.text.color} />}
    </Pressable>
  )
}

export default ChipAction

const stylesheet = createStyleSheet((theme) => ({
  chip: (hovered: boolean, focused: boolean, color: ChipColor) => {
    return {
      ...pill,
      color: theme.components.chipAction.text,
      backgroundColor: theme.components.chipAction.background[color],
      borderColor: theme.components.chipAction.border,
      borderWidth: 1,
      outlineColor: theme.components.chipAction.border,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : 'none',
      boxShadow: focused ? theme.colors.focus : 'none',
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
        selected: {
          true: {
            color: theme.components.chipAction.selected.text,
            borderColor: theme.components.chipAction.selected.border,
            backgroundColor: theme.components.chipAction.selected.background,
          },
        },
        disabled: {
          true: {
            opacity: 0.3,
          },
        },
      },
    }
  },
  text: {
    fontWeight: '400',
    color: theme.components.chipAction.text,
    variants: {
      //  Temporary explicit styles, until new font & Text component is built
      size: {
        sm: { fontSize: 13, lineHeight: 15.6, letterSpacing: -0.104 },
        md: { fontSize: 15, lineHeight: 21, letterSpacing: -0.12 },
        lg: { fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18 },
      },
      selected: {
        true: {
          color: theme.components.chipAction.selected.text,
        },
      },
    },
  },
}))
