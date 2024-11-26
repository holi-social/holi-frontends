import type React from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import type { Props } from './types'

import { useKeyboardHandler } from 'react-native-keyboard-controller'
/**
 * @description this is mobile version. It uses 'useAnimatedKeyboard()' hook from 'react-native-reanimated'
 * to animate the view 'translateY' when the keyboard is shown.
 */

const useGradualAnimation = () => {
  const height = useSharedValue(0)

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet'
        height.value = e.height
      },
      onEnd: (e) => {
        'worklet'
        height.value = e.height
      },
    },
    []
  )

  return { height }
}

const HoliKeyboardSafeAreaView = ({ style, children, testID }: React.PropsWithChildren<Props>) => {
  const { height } = useGradualAnimation()
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  )

  return (
    <Animated.View style={[styles.outer, style]} testID={testID}>
      {children}
      {Platform.OS !== 'web' ? <Animated.View style={fakeView} /> : null}
    </Animated.View>
  )
}

export default HoliKeyboardSafeAreaView

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
})
