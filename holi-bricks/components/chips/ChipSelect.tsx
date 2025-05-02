import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type { Color } from 'holi-bricks/foundations'
import { Spacing } from 'holi-bricks/foundations'
import React, { type ReactNode } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Deselect, Select } from '@holi/icons/src/generated'
// TODO: Change this import to new avatar when finished.
// eslint-disable-next-line no-restricted-imports
import type { AvatarProps } from 'holi-bricks/components/avatar'

import { chipSizeToTextSize, type ChipSelectSize } from './size'
import { pill } from './styles'
import { Avatar } from 'holi-bricks/components/avatar'

type ChipSelectProps = AccessibilityProps & {
  onPress: (event: GestureResponderEvent) => void
  children?: ReactNode
  selected?: boolean
  disabled?: boolean
  selectedColor?: Color
  size?: ChipSelectSize
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  testID?: string
}

const sizeToIconSize: Record<ChipSelectSize, number> = {
  md: 18,
  lg: 24,
}

export const ChipSelect = ({
  onPress,
  children,
  selected = false,
  disabled = false,
  selectedColor = 'green',
  size = 'md',
  avatar,
  role = 'switch',
  testID,
  ...rest
}: ChipSelectProps) => {
  const { styles, theme } = useStyles(stylesheet, { size, selected, disabled })
  const iconSize = sizeToIconSize[size]
  const icon = selected ? Deselect : Select
  const avatarSize = size === 'lg' ? 'lg' : 'xs'

  return (
    <Pressable
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      {...accessibilityProps(rest)}
      role={role}
      aria-checked={selected}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, selectedColor)]}
      testID={testID}
    >
      {avatar && (
        <View style={styles.avatar}>
          <Avatar {...avatar} size={avatarSize} />
        </View>
      )}
      {children && (
        <Text size={chipSizeToTextSize[size]} colorOverride={theme.components.chipSelect.text} selectable={false}>
          {children}
        </Text>
      )}
      <HoliIcon icon={icon} size={iconSize} colorOverride={theme.components.chipSelect.text} />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  chip: (hovered: boolean, focused: boolean, color: Color) => {
    return {
      ...pill,
      color: theme.components.chipSelect.text,
      backgroundColor: theme.components.chipSelect.background,
      borderColor: theme.components.chipSelect.border,
      borderWidth: 1,
      outlineColor: theme.components.chipSelect.border,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : 'none',
      boxShadow: focused ? theme.colors.focus : 'none',
      variants: {
        size: {
          md: {
            paddingHorizontal: Spacing['3xs'],
            minHeight: Spacing.lg,
          },
          lg: {
            paddingHorizontal: Spacing.xxs,
            minHeight: Spacing.xl,
          },
        },
        selected: {
          true: {
            backgroundColor: theme.components.chipSelect.selected.background[color],
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
  avatar: {
    variants: {
      size: {
        md: {
          width: Spacing.md,
          height: Spacing.md,
          marginLeft: -(Spacing['3xs'] - 3),
        },
        lg: {
          width: Spacing.lg,
          height: Spacing.lg,
          marginLeft: -(Spacing.xxs - 3),
        },
      },
    },
  },
}))
