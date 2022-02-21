
import * as React from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'
import useHover from '../hooks/useHover'


type ButtonProps = {
  text: string
  href?: string
}

const Button: React.FC<ButtonProps> = ({ text } : ButtonProps) => {

  const [hoverRef, isHovered] = useHover<any>()

  return (
    <>
      <Pressable ref={hoverRef} style={[styles.button, isHovered && styles.hovered]} >
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
