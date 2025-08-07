import type React from 'react'
import { useCallback, useMemo } from 'react'
import {
  type AccessibilityProps,
  type AccessibilityRole,
  type AccessibilityState,
  type GestureResponderEvent,
  type NativeMouseEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  type Role,
  type StyleProp,
  StyleSheet,
  type TargetedEvent,
  View,
  type ViewStyle,
} from 'react-native'

import type { AccessibilityRoleWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onMouseEnter?: (event: NativeSyntheticEvent<NativeMouseEvent>) => void
  onMouseOut?: (event: NativeSyntheticEvent<NativeMouseEvent>) => void
  role?: AccessibilityRoleWeb
  ariaChecked?: boolean
  accessibilityState?: AccessibilityState
}

/**
 * @deprecated Use `Button` from holiBricks instead.
 */
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

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(inline, isWarning, theme), [inline, isWarning, theme])

  const accessibilityProps: AccessibilityProps = {
    ...(Platform.OS === 'web'
      ? {
          role: (props.role || 'button') as Role,
          'aria-label': props.label,
          'aria-checked': props.ariaChecked,
        }
      : {
          accessibilityRole: (props.role || 'button') as AccessibilityRole,
          accessibilityLabel: props.label,
        }),
    accessible: !disableFocusability,

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
            if (isPrimary) result.push(styles.primaryDisabled)
            if (isWarning) result.push(styles.warningDisabled)
          } else {
            if (isPrimary) result.push(styles.primary)
            if (state.pressed) {
              if (isPrimary) result.push(styles.pressedPrimary)
              if (!isPrimary && !isWarning) result.push(styles.pressedSecondary)
            } else {
              if (state.focused) result.push(styles.focused)
              if (state.hovered) result.push(styles.hovered)
            }
          }
        }
        return [result, props.style]
      }}
    >
      <View
        style={[
          { pointerEvents: 'none' },
          !transparent && { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
          props.contentStyle,
        ]}
      >
        {content}
      </View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (inline: boolean, isWarning: boolean, theme: HoliTheme) =>
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
      borderColor: theme.colors.foreground30,
      borderWidth: 2,
      borderRadius: 28,
      backgroundColor: theme.colors.background10,
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
      color: theme.colors.foreground20,
    },
    hovered: {
      shadowColor: isWarning ? theme.colors.error30 : theme.colors.foreground30,
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
      ...Platform.select({
        web: {
          outlineColor: isWarning ? theme.colors.error30 : theme.colors.foreground30,
          outlineStyle: 'solid',
        },
      }),
    },
    pressedPrimary: {
      backgroundColor: theme.colors.brandColorA30,
    },
    pressedSecondary: {
      backgroundColor: theme.colors.background20,
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
      borderColor: theme.colors.background30,
    },
    primary: {
      backgroundColor: theme.colors.brandColorA30,
    },
    primaryDisabled: {
      backgroundColor: theme.colors.background20,
    },
    warningDisabled: {
      backgroundColor: theme.colors.background20,
    },
    warning: {
      backgroundColor: theme.colors.error10,
      borderColor: theme.colors.error30,
    },
    textWarning: {
      color: theme.colors.error30,
    },
  })
