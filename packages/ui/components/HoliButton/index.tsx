import React, { ReactChild, ReactChildren } from 'react'
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
import tinycolor from 'tinycolor2'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ButtonProps = {
  label: string
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  inline?: boolean
  href?: string
  disabled?: boolean
  active?: boolean
  transparent?: boolean
  children?: ReactChild | ReactChild[] | ReactChildren | Array<ReactChild> | string
  disableFocuasability?: boolean
  // only for TS (props are added by {...props})
  onPress?: null | ((event: GestureResponderEvent) => void)
  testID?: string
}

const HoliButton: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme, props.inline || false, props.transparent || false)
  const [disabled, setDisabled] = useState(props.disabled || false)

  const buttonText = typeof props.children === 'string' ? props.children : ''

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: `${buttonText} ${props.label}`,
  }

  const content = buttonText ? (
    <HoliText styles={[styles.text, !disabled && props.active && styles.active]}>{buttonText}</HoliText>
  ) : (
    props.children
  )

  return (
    <Pressable
      focusable={props.disableFocuasability}
      {...accessibilityProps}
      {...props}
      style={(state) => [
        styles.holiButton,
        props.style,
        !disabled && !props.transparent && state.focused && styles.focused,
        !disabled && !props.transparent && state.hovered && styles.hovered,
        !disabled && !props.transparent && state.pressed && styles.pressed,
        !disabled && props.active && styles.active,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.buttonContent}>{content}</View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (theme: HoliTheme, inline: boolean, transparent: boolean) =>
  StyleSheet.create({
    holiButton: {
      borderColor: transparent ? 'transparent' : theme.colors.borderColorBlack,
      borderWidth: 1,
      borderRadius: 10,
      //backgroundColor: transparent ? 'transparent' : theme.colors.backgroundColorWhite,
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 0,
      width: inline ? 'auto' : '100%',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          display: 'inline-block',
        },
      }),
    },
    buttonContent: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
      fontSize: 14,
      alignItems: 'center', // vertical center
      justifyContent: 'center', // horizontal center
      height: 30,
    },
    text: {
      fontSize: 14,
      color: theme.colors.fontColorBlack,
    },
    hovered: {
      backgroundColor: transparent ? 'transparent' : tinycolor(theme.colors.backgroundColorGrey).darken(3).toString(),
    },
    focused: {
      outlineColor: theme.colors.secondaryColor,
      ...Platform.select({
        web: {
          boxShadow: `0px 0px 3px 1px ${theme.colors.secondaryColor}`,
        },
      }),
    },
    pressed: {
      backgroundColor: tinycolor(theme.colors.backgroundColorGrey).lighten(3).toString(),
    },
    active: {
      backgroundColor: theme.colors.secondaryColor,
      color: theme.colors.fontColorWhite,
    },
    disabled: {
      opacity: 0.6,
    },
  })
