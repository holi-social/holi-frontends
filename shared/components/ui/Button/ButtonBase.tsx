import * as React from 'react'
import { StyleSheet, Pressable, Text, GestureResponderEvent, ViewStyle } from 'react-native'
import { useTheme } from 'shared/styles/theme'

export type ButtonProps = {
  text?: string
  style?: Record<string, unknown>
  href?: string
  testID?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
  children?: React.ReactChildren | Array<React.ReactChild> | string
}

export type PressableState = Readonly<{
  pressed: boolean
  hovered?: boolean
  focused?: boolean
}>

const Button: React.VoidFunctionComponent<ButtonProps> = (props: ButtonProps) => {
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
      borderColor: theme.colors.buttonBorderColor,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.dark ? '#0a0a0a' : '#fafafa',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 3,
      height: 50,
      display: 'flex',
      flexDirection: 'row',
    },
    hovered: {
      borderColor: '#fb345e',
      backgroundColor: theme.dark ? '#727272' : '#c2c2c2',
    },
  })

  // https://github.com/necolas/react-native-web/issues/1708
  // https://github.com/facebook/react-native/search?q=usePressability
  return (
    <Pressable
      {...props}
      onBlur={onBlur}
      onFocus={onFocus}
      style={({ pressed, hovered, focused }: PressableState) => [
        props.style,
        styles.button,
        (hovered || pressed || focused) && styles.hovered,
      ]}
    >
      {content}
    </Pressable>
  )
}

export default Button
