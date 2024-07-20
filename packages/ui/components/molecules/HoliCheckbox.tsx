import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  AccessibilityProps,
  Animated,
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  Role,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  View,
  ViewStyle,
} from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Subtract } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb, AccessibilityRoleWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

  let checkMarkColor = styles.icon.color
  if (disabled) {
    checkMarkColor = styles.iconDisabled.color
  }
  if (hasError) {
    checkMarkColor = styles.iconError.color
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
            {checked && <HoliIcon icon={checked === 'mixed' ? Subtract : Check} size={20} color={checkMarkColor} />}
          </Animated.View>

          {!children && !!label && (
            <HoliText size="small" selectable={false} style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </HoliText>
          )}
        </Pressable>
        {children && <View style={styles.label}>{children}</View>}
      </View>
      {!!errorMessage && (
        <HoliText size="extrasmall" style={styles.errorMessage}>
          {errorMessage}
        </HoliText>
      )}
    </View>
  )
}

export default HoliCheckbox

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.dark ? theme.colors.foreground30 : theme.colors.background10,
      borderColor: theme.dark ? theme.colors.foreground10 : theme.colors.background30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxSelected: {
      backgroundColor: theme.colors.foreground30,
    },
    checkboxDisabled: {
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background30,
      opacity: 0.6,
    },
    checkboxFocused: {
      borderColor: theme.colors.brandColorB30,
    },
    checkboxError: {
      borderWidth: 2,
      borderColor: theme.colors.error30,
      backgroundColor: theme.colors.background10,
    },
    shapeRound: {
      borderRadius: 24,
    },
    icon: {
      color: theme.colors.background10,
    },
    iconDisabled: {
      color: theme.colors.foreground20,
    },
    iconError: {
      color: theme.colors.foreground30,
    },
    label: {
      marginLeft: 12,
      flexShrink: 1,
    },
    labelDisabled: {
      opacity: 0.6,
    },
    errorMessage: {
      marginTop: 6,
      color: theme.colors.error30,
    },
  })
