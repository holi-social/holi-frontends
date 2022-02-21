
import * as React from 'react';
import { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import { Pressable } from 'react-native-web'
import useHover from '../hooks/useHover'


type ButtonProps = {
  text: string
  href?: string
}

const Button: React.FC<ButtonProps> = ({ text } : ButtonProps) => {

  const [hoverRef, isHovered] = useHover<HTMLDivElement>()
  const [someValue, setSomeValue]  = useState('grey')

  return (
    <>
      {/* TODO: use stylesheet */}
      <button ref={hoverRef} style={styles.button}>{text} {isHovered ? 'hovered' : 'not'}</button>
      {/* <Pressable onHoverIn={() => setSomeValue('red')} onHoverOut={() => setSomeValue('grey')}>dddd</Pressable> */}
    </>
  )
}

export default Button

// TODO: StyleSheet.create for mobile ?!
const styles = {
  button: {
    borderColor: '#fb345e', // '#fafafa',
    borderStyle: 'solid',
    padding: '10px 20px',
    margin: 0,
    backgroundColor: '#fafafa',
    borderRadius: '10px'
  }
}
