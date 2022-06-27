import * as React from 'react'
import { useState } from 'react'
import {
  AccessibilityProps,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { HoliButtonType, HoliButtonVariant } from '@holi/ui/components/HoliButton/HoliButton.types'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ButtonProps = {
  label: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  inline: boolean
  type: HoliButtonType
  variant: HoliButtonVariant
  disabled: boolean
  href?: string
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
  disableFocusability?: boolean
  // only for TS (props are added by {...props})
  onPress?: null | ((event: GestureResponderEvent) => void)
  testID?: string
}

const HoliButton: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const isSmall = () => {
    return props.variant == HoliButtonVariant.small
  }
  const isTransparent = () => {
    return props.variant == HoliButtonVariant.transparent
  }
  const isPrimary = () => {
    return props.type === HoliButtonType.primary
  }

  const { theme } = useTheme()
  const styles = getStyles(theme, props.inline || false, isTransparent())

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessible: true,
    accessibilityRole: 'button',
    ...(props.label ? { accessibilityLabel: props.label } : {}),
  }

  const content =
    typeof props.children === 'string' ? (
      <HoliText type={isSmall() ? HoliTextType.buttonSmall : HoliTextType.button}>{props.children}</HoliText>
    ) : (
      props.children
    )

  return (
    <Pressable
      focusable={!props.disableFocusability}
      {...accessibilityProps}
      {...props}
      onPress={(event) => {
        !props.disabled && props.onPress && props.onPress(event)
      }}
      style={(state) => {
        const result = [props.style]
        if (!isTransparent()) {
          result.push(styles.holiButton)
          if (isSmall()) {
            result.push(styles.small)
          }
          if (props.disabled) {
            result.push(styles.disabled)
            isPrimary() && result.push(styles.primaryDisabled)
          } else {
            isPrimary() && result.push(styles.primary)
            if (state.pressed) {
              console.log('pressed')
              isPrimary() && result.push(styles.pressedPrimary)
              !isPrimary() && result.push(styles.pressedSecondary)
            } else {
              console.log('not pressed')
              state.focused && result.push(styles.focused)
              state.hovered && result.push(styles.hovered)
            }
          }
        }
        return result
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{content}</View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (theme: HoliTheme, inline: boolean, transparent: boolean) =>
  StyleSheet.create({
    holiButton: {
      borderColor: transparent ? 'transparent' : theme.colors.borderColorBlack,
      borderWidth: 2,
      borderRadius: 24,
      backgroundColor: transparent ? 'transparent' : theme.colors.backgroundColorWhite,
      paddingHorizontal: 32,
      paddingVertical: 13,
      elevation: 0,
      width: inline ? 'auto' : '100%',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          display: 'inline-block',
        },
      }),
    },
    text: {},
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
      backgroundColor: theme.colors.backgroundColorYellowShadow,
    },
    pressedSecondary: {
      backgroundColor: theme.colors.backgroundColorWhiteShadow,
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
      opacity: 0.6,
    },
    primary: {
      backgroundColor: theme.colors.primaryColor,
    },
    primaryDisabled: {
      backgroundColor: '#f2f1ec', // TODO: keep this color changed by opacity 0.6 to f7f6f3? Or explicitly set colors for disabled style on text, background and border?
    },
  })
