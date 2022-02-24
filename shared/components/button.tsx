import * as React from 'react'
import { StyleSheet, Pressable, Text, GestureResponderEvent, Platform } from 'react-native'
import { jsVars, styleVars } from '../data/globalVars'

export type ButtonProps = {
  text?: string
  style?: Object
  href?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
}

export type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>

const Button: React.FC<ButtonProps> = (props : ButtonProps) => {
  const onBlur = (e: React.BaseSyntheticEvent) => {
    console.log('#### onBlur', e.target)
  }
  const onFocus = (e: React.BaseSyntheticEvent) => {
    console.log('#### onFocus', e.target)
  }

  console.log('############ styleVars', styleVars)



  // https://github.com/necolas/react-native-web/issues/1708
  // https://github.com/facebook/react-native/search?q=usePressability
  const buttonComponent = (
    <Pressable
      {...props}
      onBlur={onBlur}
      onFocus={onFocus}
      style={({ pressed, hovered, focused }: PressableState) => [props.style, styles.button, hovered && styles.hovered]}
    >
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  )

  return (Platform.OS === 'web')
    ? <button style={webOnlyStyles.buttonReset} className={jsVars.CSS_BUTTON_CLASS} type="button">{buttonComponent}</button>
    : buttonComponent
}

export default Button

const styles = StyleSheet.create({
  button: {
    borderColor: styleVars.buttonBorderColor.rgba,
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
    borderColor: '#fb345e'
  },
  text: {
    fontFamily: styleVars.fontFamily,
  }
})

// might also be done in web/global.scss
const webOnlyStyles = {
  buttonReset: {
    background: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    margin: 0,
    outline: 0,
    padding: 0,
    textDecoration: 'none',
  },
} as const
