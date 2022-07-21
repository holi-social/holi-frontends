import React, { ReactChild, ReactChildren, ReactNode } from 'react'
import {
  AccessibilityProps,
  AccessibilityRole,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type HoliButtonType = 'primary' | 'secondary' // for working code completion in vscode
export const HoliButtonTypes: HoliButtonType[] = ['primary', 'secondary'] // keep in sync with all possible HoliButtonType values
type HoliButtonVariant = 'default' | 'small' // for working code completion in vscode
export const HoliButtonVariants: HoliButtonVariant[] = ['default', 'small'] // keep in sync with all possible HoliButtonVariant values

export type HoliButtonProps = {
  label: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  inline?: boolean
  type?: HoliButtonType
  variant?: HoliButtonVariant
  transparent?: boolean
  disabled?: boolean
  children: ReactChild | ReactChildren | ReactNode | Element
  disableFocusability?: boolean
  accessibilityRole?: AccessibilityRole
  accessibilitySelected?: boolean
  accessibilityLabel?: string
  tabIndex?: number
  // only for TS (props are added by {...props})
  onPress?: null | ((event: GestureResponderEvent) => void)
  testID?: string
}

const HoliButton: React.FunctionComponent<HoliButtonProps> = ({
  label,
  inline = false,
  type = 'primary',
  variant = 'default',
  transparent = false,
  disabled = false,
  disableFocusability = false,
  ...props
}: HoliButtonProps) => {
  const isSmall = variant === 'small'
  const isPrimary = type === 'primary'

  const { theme } = useTheme()
  const styles = getStyles(theme, inline)

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityRole: 'button',
    ...(label ? { accessibilityLabel: label } : {}),
  }
  const content =
    typeof props.children === 'string' ? (
      <HoliText
        style={disabled ? styles.textDisabled : {}}
        size={isSmall ? 'small' : 'large'}
        bold={true}
        selectable={false}
      >
        {props.children}
      </HoliText>
    ) : (
      props.children
    )

  return (
    <Pressable
      {...accessibilityProps}
      {...props}
      disabled={disabled}
      onPress={(event) => {
        !disabled && props.onPress && props.onPress(event)
      }}
      style={(state) => {
        const result = [props.style, styles.base]
        if (!transparent) {
          result.push(styles.nonTransparent)
          if (isSmall) {
            result.push(styles.small)
          }
          if (disabled) {
            result.push(styles.disabled)
            isPrimary && result.push(styles.primaryDisabled)
          } else {
            isPrimary && result.push(styles.primary)
            if (state.pressed) {
              isPrimary && result.push(styles.pressedPrimary)
              !isPrimary && result.push(styles.pressedSecondary)
            } else {
              state.focused && result.push(styles.focused)
              state.hovered && result.push(styles.hovered)
            }
          }
        }
        return result
      }}
    >
      <View
        style={{
          ...(!transparent ? { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' } : {}),
        }}
        pointerEvents="none"
      >
        {content}
      </View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (theme: HoliTheme, inline: boolean) =>
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
      borderColor: theme.colors.borderColorBlack,
      borderWidth: 2,
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundColorWhite,
      paddingHorizontal: 32,
      paddingVertical: 13,
      margin: 4, // make the drop shadow not overlap onto other components
      elevation: 0,
      overflow: 'hidden',
    },
    textDisabled: {
      color: theme.colors.fontColorGrey,
    },
    hovered: {
      shadowColor: theme.colors.shadowColorBlack,
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    focused: {
      borderWidth: 4,
      paddingHorizontal: 30,
      paddingVertical: 11,
    },
    pressedPrimary: {
      backgroundColor: theme.colors.backgroundColorYellowDark,
    },
    pressedSecondary: {
      backgroundColor: theme.colors.backgroundColorWhiteDark,
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
      borderColor: theme.colors.borderColorBlackDisabled,
    },
    primary: {
      backgroundColor: theme.colors.primaryColor,
    },
    primaryDisabled: {
      backgroundColor: theme.colors.backgroundColorGrey,
    },
  })
