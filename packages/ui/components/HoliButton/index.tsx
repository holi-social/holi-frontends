import * as React from 'react'
import { useState } from 'react'
import { GestureResponderEvent, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

// TODO: test-id, href, onPress,
// TODO: aria-role, aria-label, focussable, ...
// TODO: mobile usage
// TODO: aktive state (font-color) core/spaces/components/navigationDrawer/navigationItem.tsx

export type ButtonProps = {
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  inline?: boolean
  href?: string
  testID?: string
  disabled?: boolean
  onPress?: null | ((event: GestureResponderEvent) => void)
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const HoliButton: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme, props.inline || false)
  const [disabled, setDisabled] = useState(props.disabled || false)
  const content =
    typeof props.children === 'string' ? <Text style={styles.text}>{props.children}</Text> : props.children

  return (
    <Pressable
      {...props}
      style={(state) => [
        styles.holiButton,
        props.style,
        !disabled && state.focused && styles.focused,
        !disabled && state.hovered && styles.hovered,
        !disabled && state.pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.buttonContent}>{content}</View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (theme: HoliTheme, inline: boolean) =>
  StyleSheet.create({
    holiButton: {
      borderColor: theme.colors.borderColorBlack,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.colors.backgroundColorWhite,
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 3,
      width: inline ? 'auto' : '100%',
      display: 'inline-block',
      overflow: 'hidden',
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
      backgroundColor: tinycolor(theme.colors.backgroundColorGrey).darken(3).toString(),
    },
    focused: {
      // boxShadow: '0px 0px 0px 1px blue',
      borderColor: '#0f0', // TODO: can't change it ?!
    },
    pressed: {
      backgroundColor: tinycolor(theme.colors.backgroundColorGrey).lighten(3).toString(),
    },
    disabled: {
      opacity: 0.6,
    },
  })
