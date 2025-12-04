import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Easing, Platform, Pressable, useWindowDimensions, View, type GestureResponderEvent } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { BorderRadius, breakpoints, IconSize, layoutStyle, Spacing, type LayoutProps } from 'holi-bricks/foundations'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close } from '@holi/icons/src/generated'
import { Animated } from 'react-native'

export type SwitchProps = AccessibilityProps &
  LayoutProps & {
    label: string
    selected?: boolean
    disabled?: boolean
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  }

export const Switch = ({ label, selected = false, disabled = false, onPress, ...rest }: SwitchProps) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const { styles } = useStyles(stylesheet, { selected, hovered, disabled, focused })
  const { width } = useWindowDimensions()
  const leftAligned = width > breakpoints.lg
  const textColor = disabled ? 'muted' : 'main'
  const translateX = useRef(new Animated.Value(selected ? 24 : 0)).current

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

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: selected ? 24 : 0,
      duration: 180,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start()
  }, [selected, translateX])

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      disabled={disabled}
      role="switch"
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
        <View style={styles.switch}>
          <Animated.View
            style={[
              styles.switchDot,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <HoliIcon icon={selected ? Check : Close} size={IconSize.sm} />
          </Animated.View>
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
  switch: {
    color: theme.colors.bg.support,
    borderColor: theme.colors.border.support,
    width: Spacing.xxl,
    height: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: BorderWidth.sm,
    backgroundColor: theme.colors.bg.main,
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
          outlineColor: theme.colors.border.purpleDefault,
          ...Platform.select({
            web: {
              outlineOffset: Spacing['4xs'],
              outlineStyle: 'solid',
            },
          }),
        },
      },
    },
  },
  switchDot: {
    color: theme.colors.bg.support,
    borderColor: theme.colors.border.default,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.pill,
    borderWidth: BorderWidth.sm,
    backgroundColor: theme.colors.bg.support,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows[300],
  },
}))
