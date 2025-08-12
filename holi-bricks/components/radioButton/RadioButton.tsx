import type React from 'react'
import { type SyntheticEvent, useCallback, useState } from 'react'
import { Platform, Pressable, useWindowDimensions, View, type GestureResponderEvent } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { BorderRadius, breakpoints, IconSize, layoutStyle, type LayoutProps } from 'holi-bricks/foundations'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import { createStyleSheet } from 'holi-bricks/styles'

export type RadioButtonProps = AccessibilityProps &
  LayoutProps & {
    label: string
    selected?: boolean
    disabled?: boolean
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  }

export const RadioButton = ({ label, selected = false, disabled = false, onPress, ...rest }: RadioButtonProps) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(false)
  styles.useVariants({ selected, hovered, disabled, focused, active })
  const { width } = useWindowDimensions()
  const leftAligned = width > breakpoints.lg
  const textColor = disabled ? 'muted' : selected || hovered ? 'main' : 'support'
  const handlePress = useCallback(
    (event: React.SyntheticEvent | GestureResponderEvent) => {
      setActive(true)
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
    setActive(false)
  }, [])

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
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
        <View style={styles.radio}>
          <View style={styles.radioDot(selected)} />
        </View>
        <Text size="md" color={textColor} selectable={false}>
          {label}
        </Text>
      </Stack>
    </Pressable>
  )
}

const styles = createStyleSheet((theme) => ({
  outer: {
    outlineWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  radio: {
    color: theme.colors.bg.support,
    borderColor: theme.colors.border.support,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.pill,
    borderWidth: BorderWidth.sm,
    backgroundColor: theme.colors.bg.support,
    alignItems: 'center',
    justifyContent: 'center',
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
          outlineColor: theme.colors.border.main,
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
  radioDot: (selected: boolean) => ({
    width: IconSize.xs,
    height: IconSize.xs,
    borderRadius: BorderRadius.pill,
    variants: {
      selected: {
        true: {
          backgroundColor: theme.colors.fill.selected,
        },
      },
      hovered: {
        true: {
          backgroundColor: selected ? theme.colors.fill.muted : theme.colors.fill.support,
        },
      },
      disabled: {
        true: {
          backgroundColor: selected ? theme.colors.fill.muted : undefined,
        },
      },
      active: {
        true: {
          ...Platform.select({
            web: {
              width: IconSize.sm,
              height: IconSize.sm,
            },
          }),
        },
      },
    },
  }),
}))
