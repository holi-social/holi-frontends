import React, { useCallback, useMemo } from 'react'
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
type HoliButtonVariant = 'default' | 'small' // for working code completion in vscode
export const HoliButtonVariants: HoliButtonVariant[] = ['default', 'small'] // keep in sync with all possible HoliButtonVariant values

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
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  accessibilityRole?: AccessibilityRole | AccessibilityRoleWeb
  accessibilityChecked?: boolean
  accessibilityState?: AccessibilityState
}

const HoliButton: React.FC<HoliButtonProps> = ({
  inline = false,
  type = 'primary',
  variant = 'default',
  transparent = false,
  disabled = false,
  disableFocusability = false,
  ...props
}: React.PropsWithChildren<HoliButtonProps>) => {
  const isSmall = variant === 'small'
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
        size={isSmall ? 'small' : 'default'}
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
      style={(state) => {
        const result: ViewStyle[] = [styles.base]
        if (!transparent) {
          result.push(styles.nonTransparent)
          if (isSmall) {
            result.push(styles.small)
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
      borderColor: colors.borderColorBlack,
      borderWidth: 2,
      borderRadius: 28,
      backgroundColor: colors.backgroundColorWhite,
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
      color: colors.fontColorGrey,
    },
    hovered: {
      shadowColor: isWarning ? colors.shadowColorError : colors.shadowColorBlack,
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
      outlineColor: isWarning ? colors.shadowColorError : colors.shadowColorBlack,
      outlineStyle: 'solid',
    },
    pressedPrimary: {
      backgroundColor: colors.backgroundColorYellowDark,
    },
    pressedSecondary: {
      backgroundColor: colors.backgroundColorGreyDark,
    },
    small: {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    textSmall: {
      fontSize: 14,
    },
    disabled: {
      borderColor: colors.borderColorBlackDisabled,
    },
    primary: {
      backgroundColor: colors.primaryColor,
    },
    primaryDisabled: {
      backgroundColor: colors.backgroundColorGrey,
    },
    warningDisabled: {
      backgroundColor: colors.backgroundColorGrey,
    },
    warning: {
      backgroundColor: colors.backgroundColorErrorLight,
      borderColor: colors.borderColorError,
    },
    textWarning: {
      color: colors.fontColorError,
    },
  })
