import React, { useCallback, useEffect, useRef, useState } from 'react'
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

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliCheckboxShape = 'square' | 'round'

export type HoliCheckboxProps = {
  label?: string
  shape?: HoliCheckboxShape
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

const HoliCheckbox: React.FC<HoliCheckboxProps> = ({
  children,
  label = '',
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
}) => {
  const checkboxRef = useRef(null)
  const [isChecked, setIsChecked] = useState(checked)
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
    accessibilityLabel: label,
    accessibilityChecked: disabled ? false : isChecked,
  }

  const onPress = useCallback(
    (event: GestureResponderEvent) => {
      setIsChecked(!isChecked)
      onSelect(!isChecked, event)
    },
    [isChecked, setIsChecked, onSelect]
  )

  const runAnimation = (value: number, velocity: number) => {
    Animated.spring(scaleFactor, {
      toValue: value,
      velocity,
      bounciness: 20,
      useNativeDriver: true,
    }).start()
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
          onPressIn={() => {
            runAnimation(0.8, 0.1)
          }}
          onPressOut={() => {
            runAnimation(1, 0.4)
          }}
          onPress={onPress}
          style={styles.checkboxContainer}
          testID={testID}
        >
          <Animated.View
            style={[
              styles.checkbox,
              isChecked && styles.checkboxSelected,
              disabled && styles.checkboxDisabled,
              hasError && styles.checkboxError,
              shape === 'round' && styles.shapeRound,
              { transform: [{ scale: scaleFactor }] },
            ]}
          >
            {isChecked && (
              <HoliIcon
                icon="check"
                size={20}
                style={[styles.icon, disabled && styles.iconDisabled, hasError && styles.iconError]}
              />
            )}
          </Animated.View>

          {!children && (
            <HoliText size="small" selectable={false} style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </HoliText>
          )}
        </Pressable>
        {children && <View style={styles.label}>{children}</View>}
      </View>
      {errorMessage && (
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
    backgroundColor: colors.backgroundColor,
  },
  shapeRound: {
    borderRadius: 24,
  },
  icon: {
    color: colors.fontColorWhite,
  },
  iconDisabled: {
    color: colors.foreground20,
  },
  iconError: {
    color: colors.foreground30,
  },
  label: {
    marginLeft: 12,
    // maxWidth: '100%',
    flex: 1,
  },
  labelDisabled: {
    opacity: 0.6,
  },
  errorMessage: {
    marginTop: 6,
    color: colors.error30,
  },
})
