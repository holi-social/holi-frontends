
// import * as React, { useRef } from 'react'
import React, { useRef, useEffect } from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'
// import useHover from '../hooks/useHover'


export type ButtonProps = {
  text?: string
  onPress?: (event: React.BaseSyntheticEvent) => void
  href?: string
}

export type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>

const Button: React.FC<ButtonProps> = ({ text, onPress } : ButtonProps) => {


  // workaround for adding a static className (necessary for the web app)
  // see here: https://github.com/necolas/react-native-web/issues/1318
  // but causes flickering as it is done after rendering
  const viewRef: any = useRef<Element | null>(null)
  const GLOBAL_BUTTON_CLASS  = 'holi-btn'
  useEffect(() => {
    viewRef.current.setNativeProps({
      className: GLOBAL_BUTTON_CLASS
    })
  }, [, viewRef])

  const onBlur = (e: React.BaseSyntheticEvent) => {
    console.log('#### onBlur', e.target)
  }
  const onFocus = (e: React.BaseSyntheticEvent) => {
    console.log('#### onFocus', e.target)
  }

  // https://github.com/necolas/react-native-web/issues/1708
  const buttonComponent = (
    <Pressable
        ref={viewRef}
        onPress={onPress}
        onBlur={onBlur}
        onFocus={onFocus}
        style={({ pressed, hovered, focused }: PressableState) => [styles.button, hovered && styles.hovered]}
      >
        <Text>{text}</Text>
      </Pressable>
  )

  return buttonComponent

  // const [hoverRef, isHovered] = useHover<Element>()
  // return (
  //   <>
  //     {/* With custom hover hook via ref: */}
  //     <Pressable ref={hoverRef} style={[styles.button, isHovered && styles.hovered]}>
  //       <Text>{text}</Text>
  //     </Pressable>
  //   </>
  // )
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
