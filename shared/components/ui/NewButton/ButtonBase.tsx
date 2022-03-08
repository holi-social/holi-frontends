import * as React from 'react'
import {
  StyleSheet,
  Pressable,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { useTheme } from 'shared/styles/theme'

export type ButtonProps = {
  text?: string
  style?: Object
  href?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
}

export type PressableState = Readonly<{
  pressed: boolean
  hovered?: boolean
  focused?: boolean
}>

const Button: React.VoidFunctionComponent<ButtonProps> = (
  props: ButtonProps
) => {
  const onBlur = (e: React.BaseSyntheticEvent) => {
    console.log('#### onBlur', e.target)
  }
  const onFocus = (e: React.BaseSyntheticEvent) => {
    console.log('#### onFocus', e.target)
  }

  const { theme } = useTheme()

  // Jasper: just wanted to see, if we can avoid writing invalid style objects
  const styles = StyleSheet.create<{
    button: ViewStyle
    hovered: ViewStyle
    text: TextStyle
  }>({
    button: {
      // muss das hier im theme liegen? nein! Im Theme liegen globale Werte. Die Button Component hat lokale Styles und nutzt globale styles. Button spezifische Farbe muss nicht global sein
      borderColor: theme.colors.buttonBorderColor,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.dark ? '#0a0a0a' : '#fafafa',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 3,
    },
    hovered: {
      borderColor: '#fb345e',
      backgroundColor: theme.dark ? '#727272' : '#c2c2c2',
    },
    text: {
      color: theme.dark ? '#ffffff' : '#000000',
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
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  )
}

export default Button
