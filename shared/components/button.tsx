
import * as React from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'
import useHover from '../hooks/useHover'


export type ButtonProps = {
  text: string
  onPress: (event: React.BaseSyntheticEvent) => void
  href?: string
}

export type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>


const Button: React.FC<ButtonProps> = ({ text, onPress } : ButtonProps) => {

  const [hoverRef, isHovered] = useHover<Element>()

  const onBlur = (e: React.BaseSyntheticEvent) => {
    console.log('#### onBlur', e.target)
  }
  const onFocus = (e: React.BaseSyntheticEvent) => {
    console.log('#### onFocus', e.target)
  }

  return (
    <>
      {/* With custom hover hook via ref: */}
      {/* <Pressable ref={hoverRef} style={[styles.button, isHovered && styles.hovered]}>
        <Text>{text}</Text>
      </Pressable> */}

      {/* With react-native interaction: */}
      {/* https://github.com/necolas/react-native-web/issues/1708 */}
      <Pressable
        onPress={onPress}
        onBlur={onBlur}
        onFocus={onFocus}
        style={({ pressed, hovered, focused }: PressableState) => [styles.button, hovered && styles.hovered]}
      >
        <Text>{text}</Text>
      </Pressable>
    </>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    borderColor: 'pink', // '#fafafa',
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
  }
})
