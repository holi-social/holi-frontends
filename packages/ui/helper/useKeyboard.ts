/**
 * The given height refers only to the native mobile keyboard.
 * It returns 0 in the cellphone's browser. That keyboard is
 * calles "softkeyboard"
 */
import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const onKeyboardDidShow = (e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height)
  }

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0)
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return { keyboardHeight }
}
