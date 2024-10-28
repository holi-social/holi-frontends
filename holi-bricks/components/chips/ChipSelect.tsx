import { Text } from 'holi-bricks/components/text/Text'
import { useStyles } from 'holi-bricks/hooks'
import type { Color } from 'holi-bricks/tokens'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import { byShade } from 'holi-bricks/utils/byShade'
import React, { ReactNode } from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Deselect, Select } from '@holi/icons/src/generated'
// TODO: Change this import to new avatar when finished.
// eslint-disable-next-line no-restricted-imports
import HoliAvatar, { AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'

import { ChipSize, chipSizeToTextSize } from './size'
import { pill } from './styles'

type ChipSelectProps = {
  onPress: (event: GestureResponderEvent) => void
  children?: ReactNode
  selected?: boolean
  disabled?: boolean
  selectedColor?: Color
  size?: ChipSize
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'imageSrc' | 'imageBlurhash'>
}

const sizeToIconSize: Record<ChipSize, number> = {
  sm: 12,
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
}: ChipSelectProps) => {
  const { styles, theme } = useStyles(stylesheet, { size, selected, disabled })
  const iconSize = sizeToIconSize[size]
  const icon = selected ? Deselect : Select
  const avatarSize = size === 'lg' ? 'small' : 'micro'

  return (
    <Pressable
      role="switch"
      aria-checked={selected}
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, selectedColor)]}
    >
      {avatar && (
        <HoliAvatar
          {...avatar}
          size={avatarSize}
          defaultColor={byShade('600')[selectedColor]}
          initialsColor={theme.components.chipSelect.text}
          style={styles.avatar}
        />
      )}
      {children && (
        <Text size={chipSizeToTextSize[size]} color={theme.components.chipSelect.text} selectable={false}>
          {children}
        </Text>
      )}
      <HoliIcon icon={icon} size={iconSize} color={theme.components.chipSelect.text} />
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
          sm: {
            paddingHorizontal: Spacing['3xs'],
            minHeight: Spacing.md,
          },
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
        sm: {
          width: 18,
          height: 18,
          marginLeft: -(Spacing['3xs'] - 2),
        },
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
