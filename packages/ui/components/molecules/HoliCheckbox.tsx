import type React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import {
  type AccessibilityProps,
  Animated,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  Pressable,
  type Role,
  type StyleProp,
  type TargetedEvent,
  View,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Subtract } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb, AccessibilityRoleWeb } from '@holi/ui/@types/reactNativeWeb'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'

export type HoliCheckboxShape = 'square' | 'round' | 'box'
export type HoliCheckboxValue = boolean | 'mixed'

export type HoliCheckboxProps = {
  label?: string
  shape?: HoliCheckboxShape
  'aria-label': string
  role?: AccessibilityRoleWeb
  checked?: HoliCheckboxValue
  errorMessage?: string
  onSelect?: (checked: boolean, event: GestureResponderEvent) => void
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  disabled?: boolean
  autofocus?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliCheckbox = ({
  children,
  label,
  'aria-label': ariaLabel,
  shape = 'box',
  role = 'checkbox',
  checked = false,
  errorMessage,
  onSelect = () => null,
  onFocus = () => null,
  onBlur = () => null,
  disabled = false,
  autofocus = false,
  style,
  testID,
}: React.PropsWithChildren<HoliCheckboxProps>) => {
  const checkboxRef = useRef<View>(null)
  const scaleFactor = useRef(new Animated.Value(1)).current
  const hasError = !!errorMessage

  useEffect(() => {
    if (autofocus) checkboxRef?.current?.focus()
  }, [autofocus])

  // https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html
  // resp. https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/
  // https://www.w3.org/WAI/ARIA/apg/example-index/radio/radio-rating.html
  const accessibilityProps: AccessibilityPropsWeb = {
    accessible: !disabled,
    role: disabled ? 'none' : (role as Role),
    'aria-label': ariaLabel,
    'aria-checked': disabled ? false : checked,
  }

  const onPress = useCallback(
    (event: GestureResponderEvent) => {
      onSelect(!checked || checked === 'mixed', event)
    },
    [checked, onSelect]
  )

  const runAnimation = (value: number, velocity: number) => {
    Animated.spring(scaleFactor, {
      toValue: value,
      velocity,
      bounciness: 20,
      useNativeDriver: true,
    }).start()
  }

  const iconColorOverride = () => {
    if (disabled) return styles.iconDisabled.color
    if (hasError) return styles.iconError.color
    return styles.icon.color
  }

  return (
    <View style={style}>
      <View style={styles.checkboxContainer}>
        <Pressable
          {...(accessibilityProps as AccessibilityProps)}
          ref={checkboxRef}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onPressIn={() => runAnimation(0.8, 0.1)}
          onPressOut={() => runAnimation(1, 0.4)}
          onPress={onPress}
          style={styles.checkboxContainer}
          testID={testID}
        >
          <Animated.View
            style={[
              styles.checkbox,
              checked && styles.checkboxSelected,
              disabled && styles.checkboxDisabled,
              hasError && styles.checkboxError,
              shape === 'round' && styles.shapeRound,
              { transform: [{ scale: scaleFactor }] },
            ]}
          >
            {checked && (
              <HoliIcon icon={checked === 'mixed' ? Subtract : Check} size={20} colorOverride={iconColorOverride()} />
            )}
          </Animated.View>

          {!children && !!label && (
            <Stack margin={{ left: 'xxs' }} flexShrink={1}>
              <Text size="sm" selectable={false} color={disabled ? 'muted' : 'main'}>
                {label}
              </Text>
            </Stack>
          )}
        </Pressable>

        {children && (
          <Stack margin={{ left: 'xxs' }} flexShrink={1}>
            {children}
          </Stack>
        )}
      </View>

      {!!errorMessage && (
        <Stack margin={{ top: '3xs' }}>
          <Text size="xs" color="danger">
            {errorMessage}
          </Text>
        </Stack>
      )}
    </View>
  )
}

export default HoliCheckbox

const styles = StyleSheet.create((theme) => ({
  checkboxContainer: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: theme.colors.bg.support,
    borderColor: theme.colors.border.support,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.bg.selected,
  },
  checkboxDisabled: {
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.bg.muted,
    opacity: 0.6,
  },
  checkboxFocused: {
    borderColor: '#6267e7',
  },
  checkboxError: {
    borderWidth: 2,
    borderColor: theme.colors.fill.danger,
    backgroundColor: theme.colors.bg.support,
  },
  shapeRound: {
    borderRadius: 24,
  },
  icon: {
    color: theme.colors.fill.selected,
  },
  iconDisabled: {
    color: theme.colors.fill.muted,
  },
  iconError: {
    color: theme.colors.fill.main,
  },
  errorMessage: {
    marginTop: 6,
    color: theme.colors.fill.danger,
  },
}))
