import type React from 'react'
import { useCallback, useState } from 'react'
import { Platform, Pressable, useWindowDimensions, View, type GestureResponderEvent } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { BorderRadius, breakpoints, layoutStyle, type LayoutProps } from 'holi-bricks/foundations'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check } from '@holi/icons/src/generated'

export type CheckboxProps = AccessibilityProps &
  LayoutProps & {
    label: string
    selected?: boolean | 'indeterminate'
    disabled?: boolean
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  }

export const Checkbox = ({ label, selected = false, disabled = false, onPress, ...rest }: CheckboxProps) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const isChecked = selected === true
  const isIndeterminate = selected === 'indeterminate'
  const { styles } = useStyles(stylesheet, { selected: isChecked || isIndeterminate, hovered, disabled, focused })
  const { width } = useWindowDimensions()
  const leftAligned = width > breakpoints.lg
  const textColor = disabled ? 'muted' : selected || hovered ? 'main' : 'support'
  const handlePress = useCallback(
    (event: React.SyntheticEvent | GestureResponderEvent) => {
      return onPress?.(event)
    },
    [onPress]
  )
  const onKeyDownCapture = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.code === 'Space') {
        return handlePress(event)
      }
    },
    [handlePress]
  )
  const onBlur = useCallback(() => {
    setFocused(false)
  }, [])

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      disabled={disabled}
      role="checkbox"
      aria-checked={isChecked}
      {...accessibilityProps(rest)}
      style={[styles.outer, layoutStyle(rest)]}
      {...Platform.select({ web: { onKeyDownCapture } })}
    >
      <Stack
        direction={leftAligned ? 'row' : 'row-reverse'}
        gap="3xs"
        alignItems="center"
        minHeight={40}
        justifyContent={leftAligned ? 'flex-start' : 'space-between'}
      >
        <View style={styles.checkbox}>
          {isChecked && <HoliIcon icon={Check} color="selected" />}
          {isIndeterminate && <View style={styles.indeterminateBar} />}
        </View>
        <Text color={textColor} selectable={false}>
          {label}
        </Text>
      </Stack>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  outer: {
    outlineWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: undefined,
      },
    }),
  },
  checkbox: {
    color: theme.colors.bg.support,
    borderColor: theme.colors.border.support,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xxs,
    borderWidth: BorderWidth.sm,
    backgroundColor: theme.colors.bg.support,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    variants: {
      hovered: {
        true: {
          borderColor: theme.colors.border.main,
        },
      },
      selected: {
        true: {
          backgroundColor: theme.colors.bg.selected,
          borderColor: theme.colors.border.main,
        },
        indeterminate: {
          backgroundColor: theme.colors.bg.selected,
          borderColor: theme.colors.border.main,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.bg.muted,
          borderColor: theme.colors.border.support,
        },
      },
      focused: {
        true: {
          outlineWidth: BorderWidth.sm,
          outlineColor: theme.colors.border.purpleDefault,
          ...Platform.select({
            web: {
              outlineOffset: 4,
              outlineStyle: 'solid',
            },
          }),
        },
      },
    },
  },
  indeterminateBar: {
    width: 12,
    height: 2,
    backgroundColor: theme.colors.fill.selected,
    borderRadius: 1,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -6 }, { translateY: -1 }],
  },
}))
