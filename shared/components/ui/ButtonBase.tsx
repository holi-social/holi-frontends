import * as React from 'react'
import {
  StyleSheet,
  Pressable,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { jsVars, styleVars } from 'shared/styles/globalVars'

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

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const onBlur = (e: React.BaseSyntheticEvent) => {
    console.log('#### onBlur', e.target)
  }
  const onFocus = (e: React.BaseSyntheticEvent) => {
    console.log('#### onFocus', e.target)
  }

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
        hovered && styles.hovered,
      ]}
    >
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  )
}

export default Button

// Jasper: just wanted to see, if we can avoid writing invalid style objects
const styles = StyleSheet.create<{
  button: ViewStyle
  hovered: ViewStyle
  text: TextStyle
}>({
  button: {
    borderColor: styleVars.buttonBorderColor,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 3,
  },
  hovered: {
    borderColor: '#fb345e',
  },
  text: {
    fontFamily: styleVars.fontFamilyMobile,
  },
})
