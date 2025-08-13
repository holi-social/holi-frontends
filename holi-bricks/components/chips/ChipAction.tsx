import { StyleSheet } from 'react-native-unistyles'
import type React from 'react'
import { type GestureResponderEvent, Pressable } from 'react-native'

import { type Color, type LayoutProps, layoutStyle, Spacing } from 'holi-bricks/foundations'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { Text } from 'holi-bricks/components/text'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'

import { type ChipSize, chipSizeToTextSize } from './size'
import { pill } from './styles'

type ChipColor = Color | 'white'

export type ChipActionProps = AccessibilityProps &
  LayoutProps & {
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
    children?: string
    selected?: boolean
    disabled?: boolean
    color?: ChipColor
    size?: ChipSize
    iconLeading?: HoliIconType
    iconTrailing?: HoliIconType
    'aria-label'?: string
    testID?: string
  }

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
  styles.useVariants({ size, selected, disabled })
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <Pressable
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      {...accessibilityProps(rest)}
      aria-checked={selected}
      role={role}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, color), layoutStyle(rest)]}
      testID={testID}
    >
      {iconLeading && <HoliIcon icon={iconLeading} size={iconSize} colorOverride={styles.text.color} />}
      {children && (
        <Text size={chipSizeToTextSize[size]} colorOverride={styles.text.color} selectable={false}>
          {children}
        </Text>
      )}
      {iconTrailing && <HoliIcon icon={iconTrailing} size={iconSize} colorOverride={styles.text.color} />}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  chip: (hovered: boolean, focused: boolean, color: ChipColor) => {
    return {
      ...pill,
      color: theme.components.chipAction.text,
      backgroundColor: theme.components.chipAction.background[color],
      borderColor: theme.components.chipAction.border,
      borderWidth: 1,
      outlineColor: theme.components.chipAction.border,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : undefined,
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
