import * as React from 'react'
import { StyleSheet, Pressable, Text, GestureResponderEvent, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'
import { useTheme } from '@holi/styles/theme'

export type ButtonProps = {
  text?: string
  style?: Record<string, unknown>
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
  }>({
    button: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.dark ? theme.colors.background : theme.colors.backgroundGrey,
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
      borderColor: tinycolor(theme.colors.backgroundGrey).darken(15).toString(),
      backgroundColor: theme.dark ? theme.colors.backgroundGrey : theme.colors.background,
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
        props.style,
        (hovered || pressed || focused) && styles.hovered,
      ]}
    >
      {content}
    </Pressable>
  )
}

export default Button
