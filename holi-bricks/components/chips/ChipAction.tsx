import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/accessibility'

import type { SelectionElementProps } from 'holi-bricks/components/selectors/Selector'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import type { Color } from 'holi-bricks/tokens'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { type GestureResponderEvent, Pressable } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'

import { type ChipSize, chipSizeToTextSize } from './size'
import { pill } from './styles'

type ChipColor = Color | 'white'

type ChipActionProps = AccessibilityProps & {
  onPress: (event: GestureResponderEvent) => void
  children?: string
  selected?: boolean
  disabled?: boolean
  color?: ChipColor
  size?: ChipSize
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
  testID?: string
} & SelectionElementProps

export const ChipAction = ({
  onPress,
  children,
  selected = false,
  disabled = false,
  color = 'mono',
  size = 'md',
  iconLeading,
  iconTrailing,
  role = 'switch',
  testID,
  ...rest
}: ChipActionProps) => {
  const { styles } = useStyles(stylesheet, { size, selected, disabled })
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <Pressable
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      {...accessibilityProps(rest)}
      aria-checked={selected}
      role={role}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, color)]}
      testID={testID}
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
