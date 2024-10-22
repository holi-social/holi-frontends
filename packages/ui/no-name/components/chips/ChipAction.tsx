import React from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import Spacing from '@holi/ui/foundations/Spacing'
import { Text } from '@holi/ui/no-name/components/text/Text'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

import { ChipSize, chipSizeToTextSize } from './size'
import { pill } from './styles'

type ChipColor = Color | 'white'

type ChipActionProps = {
  onPress: (event: GestureResponderEvent) => void
  children?: string
  selected?: boolean
  disabled?: boolean
  color?: ChipColor
  size?: ChipSize
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
  'aria-label'?: string
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
  'aria-label': ariaLabel,
}: ChipActionProps) => {
  const { styles } = useStyles(stylesheet, { size, selected, disabled })
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <Pressable
      role="switch"
      aria-checked={selected}
      aria-label={ariaLabel}
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, color)]}
    >
      {iconLeading && <HoliIcon icon={iconLeading} size={iconSize} color={styles.text.color} />}
      {children && (
        <Text size={chipSizeToTextSize[size]} color={styles.text.color} selectable={false}>
          {children}
        </Text>
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
    color: theme.components.chipAction.text,
    variants: {
      selected: {
        true: {
          color: theme.components.chipAction.selected.text,
        },
      },
    },
  },
}))
