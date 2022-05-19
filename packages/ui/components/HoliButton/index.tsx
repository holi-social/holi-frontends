import * as React from 'react'
import { useState } from 'react'
import { GestureResponderEvent, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

// TODO: href
// TODO: mobile usage
// TODO: switch off accessibility

export type ButtonProps = {
  label: string
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  inline?: boolean
  href?: string
  disabled?: boolean
  active?: boolean
  transparent?: boolean
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
  disableFocuasability?: boolean
  // ony for TS (props are added by {...props})
  onPress?: null | ((event: GestureResponderEvent) => void)
  testID?: string
}

const HoliButton: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme, props.inline || false, props.transparent || false)
  const [disabled, setDisabled] = useState(props.disabled || false)

  const buttonText = typeof props.children === 'string' ? props.children : ''
  const accessibilityProps: { accessibilityLabel?: string } = {
    accessibilityLabel: `${buttonText} ${props.label}`,
  }
  const content = buttonText ? (
    <Text style={[styles.text, !disabled && props.active && styles.active]}>{buttonText}</Text>
  ) : (
    props.children
  )

  return (
    <Pressable
      accessible={true}
      focusable={props.disableFocuasability}
      accessibilityRole="button"
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
      backgroundColor: transparent ? 'transparent' : theme.colors.backgroundColorWhite,
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 3,
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
    },
    hovered: {
      backgroundColor: transparent ? 'transparent' : tinycolor(theme.colors.backgroundColorGrey).darken(3).toString(),
    },
    focused: {
      boxShadow: `0px 0px 3px 1px ${theme.colors.secondaryColor}`,
      borderColor: theme.colors.secondaryColor,
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
