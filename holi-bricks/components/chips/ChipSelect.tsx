import { StyleSheet } from 'react-native-unistyles'
import React, { type ReactNode } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { Text } from 'holi-bricks/components/text'
import { type Color, layoutStyle, Spacing, type LayoutProps } from 'holi-bricks/foundations'
import { type AccessibilityProps, accessibilityProps } from 'holi-bricks/foundations/accessibility'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Deselect, Select } from '@holi/icons/src/generated'
import type { AvatarProps } from 'holi-bricks/components/avatar'

import { Avatar } from 'holi-bricks/components/avatar'
import { type ChipSelectSize, chipSizeToTextSize } from './size'
import { pill } from './styles'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import { Stack } from 'holi-bricks/components/stack'

export type ChipSelectColor = Color | 'yellowLight'

type ChipSelectProps = AccessibilityProps &
  LayoutProps & {
    onPress: (event: GestureResponderEvent) => void
    children?: ReactNode
    selected?: boolean
    disabled?: boolean
    selectedColor?: ChipSelectColor
    size?: ChipSelectSize
    avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
    testID?: string
    counter?: string
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
  counter,
  ...rest
}: ChipSelectProps) => {
  styles.useVariants({ size, selected, disabled })
  const { theme } = useBricks()
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
      style={(state) => {
        const hovered = 'hovered' in state ? state.hovered : false
        const focused = 'focused' in state ? state.focused : false
        return [styles.chip(!!hovered, !disabled && !!focused, selectedColor), layoutStyle(rest)]
      }}
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
      {counter && (
        <Stack
          backgroundColor="muted"
          borderRadius="pill"
          padding={{
            top: '5xs',
            bottom: '5xs',
            left: '4xs',
            right: '4xs',
          }}
        >
          <Text size="xs" margin={{ left: '5xs', right: '5xs' }}>
            {counter}
          </Text>
        </Stack>
      )}
      <HoliIcon icon={icon} size={iconSize} colorOverride={theme.components.chipSelect.text} />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  chip: (hovered: boolean, focused: boolean, color: ChipSelectColor) => {
    return {
      ...pill,
      color: theme.components.chipSelect.text,
      backgroundColor: theme.components.chipSelect.background,
      borderColor: theme.components.chipSelect.border,
      borderWidth: 1,
      outlineColor: theme.components.chipSelect.border,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : undefined,
      boxShadow: focused ? theme.colors.focus : undefined,
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
