import React, { MouseEvent, SyntheticEvent, useCallback, useMemo } from 'react'
import {
  AccessibilityProps,
  AccessibilityRole,
  AccessibilityState,
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  View,
  ViewStyle,
} from 'react-native'

import type { AccessibilityPropsWeb, AccessibilityRoleWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliButtonType = 'primary' | 'secondary' | 'warning' // for working code completion in vscode
export const HoliButtonTypes: HoliButtonType[] = ['primary', 'secondary', 'warning'] // keep in sync with all possible HoliButtonType values
type HoliButtonVariant = 'default' | 'small' | 'medium' // for working code completion in vscode
export const HoliButtonVariants: HoliButtonVariant[] = ['default', 'small', 'medium'] // keep in sync with all possible HoliButtonVariant values

export interface HoliButtonProps {
  label: string
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  inline?: boolean
  type?: HoliButtonType
  variant?: HoliButtonVariant
  transparent?: boolean
  disabled?: boolean
  disableFocusability?: boolean
  testID?: string
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onMouseEnter?: (event: SyntheticEvent<Element, MouseEvent>) => void
  onMouseOut?: (event: SyntheticEvent<Element, MouseEvent>) => void
  accessibilityRole?: AccessibilityRole | AccessibilityRoleWeb
  accessibilityChecked?: boolean
  accessibilityState?: AccessibilityState
}

const HoliButton = ({
  inline = false,
  type = 'primary',
  variant = 'default',
  transparent = false,
  disabled = false,
  disableFocusability = false,
  ...props
}: React.PropsWithChildren<HoliButtonProps>) => {
  const isSmall = variant === 'small'
  const isMedium = variant === 'medium'
  const isPrimary = type === 'primary'
  const isWarning = type === 'warning'

  const styles = useMemo(() => getStyles(inline, isWarning), [inline, isWarning])

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityRole: props.accessibilityRole || 'button',
    accessibilityLabel: props.label,
    accessibilityChecked: props.accessibilityChecked,
    accessibilityState: props.accessibilityState,
  }

  const content =
    typeof props.children === 'string' ? (
      <HoliText
        style={[styles.text, isWarning ? styles.textWarning : {}, disabled ? styles.textDisabled : {}]}
        size={isSmall || isMedium ? 'small' : 'default'}
        bold={true}
        selectable={false}
      >
        {props.children}
      </HoliText>
    ) : (
      props.children
    )

  const onButtonPress = useCallback(
    (event: React.SyntheticEvent | GestureResponderEvent) => {
      if (props.onPress && !disabled) props.onPress(event)
    },
    [disabled, props]
  )

  return (
    <Pressable
      {...accessibilityProps}
      testID={props.testID}
      disabled={disabled}
      onPress={onButtonPress}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onHoverIn={props.onMouseEnter}
      onHoverOut={props.onMouseOut}
      style={(state) => {
        const result: ViewStyle[] = [styles.base]
        if (!transparent) {
          result.push(styles.nonTransparent)
          if (isSmall) {
            result.push(styles.small)
          }
          if (isMedium) {
            result.push(styles.medium)
          }
          if (isWarning) {
            result.push(styles.warning)
          }
          if (disabled) {
            result.push(styles.disabled)
            isPrimary && result.push(styles.primaryDisabled)
            isWarning && result.push(styles.warningDisabled)
          } else {
            isPrimary && result.push(styles.primary)
            if (state.pressed) {
              isPrimary && result.push(styles.pressedPrimary)
              !isPrimary && !isWarning && result.push(styles.pressedSecondary)
            } else {
              state.focused && result.push(styles.focused)
              state.hovered && result.push(styles.hovered)
            }
          }
        }
        return [result, props.style]
      }}
    >
      <View
        style={[
          !transparent && { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
          props.contentStyle,
        ]}
        pointerEvents="none"
      >
        {content}
      </View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (inline: boolean, isWarning: boolean) =>
  StyleSheet.create({
    base: {
      ...Platform.select({
        web: {
          display: 'inline-block',
        },
      }),
      width: inline ? 'auto' : '100%',
    },
    nonTransparent: {
      borderColor: colors.foreground30,
      borderWidth: 2,
      borderRadius: 28,
      backgroundColor: colors.background10,
      paddingHorizontal: 32,
      paddingVertical: 13,
      elevation: 0,
      overflow: 'hidden',
      justifyContent: 'center',
      display: 'flex',
    },
    text: {
      textAlign: 'center',
    },
    textDisabled: {
      color: colors.foreground20,
    },
    hovered: {
      shadowColor: isWarning ? colors.error30 : colors.foreground30,
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    focused: {
      outlineWidth: 2,
      outlineColor: isWarning ? colors.error30 : colors.foreground30,
      outlineStyle: 'solid',
    },
    pressedPrimary: {
      backgroundColor: colors.brandColorA30,
    },
    pressedSecondary: {
      backgroundColor: colors.background20,
    },
    small: {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    medium: {
      paddingVertical: 10,
    },
    textSmall: {
      fontSize: 14,
    },
    disabled: {
      borderColor: colors.background30,
    },
    primary: {
      backgroundColor: colors.brandColorA30,
    },
    primaryDisabled: {
      backgroundColor: colors.background20,
    },
    warningDisabled: {
      backgroundColor: colors.background20,
    },
    warning: {
      backgroundColor: colors.error10,
      borderColor: colors.error30,
    },
    textWarning: {
      color: colors.error30,
    },
  })
