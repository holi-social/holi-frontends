import React, { useCallback, useEffect, useRef } from 'react'
import {
  AccessibilityProps,
  AccessibilityRole,
  Animated,
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  View,
  ViewStyle,
} from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliCheckboxShape = 'square' | 'round' | 'box'

export type HoliCheckboxProps = {
  label?: string
  shape?: HoliCheckboxShape
  accessibilityLabel: string
  accessibilityRole?: AccessibilityRole
  checked?: boolean
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
  accessibilityLabel,
  shape = 'box',
  accessibilityRole = 'checkbox',
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
  const checkboxRef = useRef(null)
  const scaleFactor = useRef(new Animated.Value(1)).current
  const hasError = !!errorMessage

  useEffect(() => {
    if (autofocus) checkboxRef?.current?.focus()
  }, [autofocus])

  // https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html
  // https://www.w3.org/WAI/ARIA/apg/example-index/radio/radio-rating.html
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !disabled,
    accessibilityRole: disabled ? 'none' : accessibilityRole,
    accessibilityLabel: accessibilityLabel,
    accessibilityChecked: disabled ? false : checked,
  }

  const onPress = useCallback(
    (event: GestureResponderEvent) => {
      onSelect(!checked, event)
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
          {...accessibilityProps}
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
            {checked && <HoliIcon icon={Check} size={20} color={checkMarkColor} />}
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

const styles = StyleSheet.create({
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
    backgroundColor: colors.background10,
    borderColor: colors.background30Darker,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.foreground30,
  },
  checkboxDisabled: {
    borderColor: colors.background30,
    backgroundColor: colors.background30,
    opacity: 0.6,
  },
  checkboxFocused: {
    borderColor: colors.brandColorB30,
  },
  checkboxError: {
    borderWidth: 2,
    borderColor: colors.error30,
    backgroundColor: colors.background10,
  },
  shapeRound: {
    borderRadius: 24,
  },
  icon: {
    color: colors.background10,
  },
  iconDisabled: {
    color: colors.foreground20,
  },
  iconError: {
    color: colors.foreground30,
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
    color: colors.error30,
  },
})
