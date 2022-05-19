import * as React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet, Text, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import { useTheme } from '@holi/ui/styles/theme'

export type ButtonProps = {
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  fullWidth?: boolean
  href?: string
  testID?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

export type PressableState = Readonly<{
  pressed: boolean
  hovered?: boolean
  focused?: boolean
}>

const Button: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const onBlur = (e: React.BaseSyntheticEvent) => {
    console.log('#### onBlur', e.target)
  }
  const onFocus = (e: React.BaseSyntheticEvent) => {
    console.log('#### onFocus', e.target)
  }

  const content = typeof props.children === 'string' ? <Text>{props.children}</Text> : props.children

  const { theme } = useTheme()

  const styles = StyleSheet.create<{
    button: ViewStyle
    hovered: ViewStyle
    fullWidth: ViewStyle
  }>({
    button: {
      borderColor: theme.colors.borderColorBlack,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.colors.backgroundColorWhite,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 3,
      height: 50,
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
    },
    hovered: {
      borderColor: tinycolor(theme.colors.backgroundColorGrey).darken(15).toString(),
      backgroundColor: theme.colors.backgroundColorWhite,
    },
    fullWidth: {
      width: '100%',
    },
  })

  // https://github.com/necolas/react-native-web/issues/1708
  // https://github.com/facebook/react-native/search?q=usePressability
  return (
    <Pressable
      onBlur={onBlur}
      onFocus={onFocus}
      {...props}
      style={({ pressed, hovered, focused }: PressableState) => [
        styles.button,
        props.fullWidth && styles.fullWidth,
        props.style,
        (hovered || pressed || focused) && styles.hovered,
      ]}
    >
      {content}
    </Pressable>
  )
}

export default Button
