import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'

import { Props } from './types'

/**
 * @description this is mobile version. It uses 'useAnimatedKeyboard()' hook from 'react-native-reanimated'
 * to animate the view 'translateY' when the keyboard is shown.
 */

const HoliKeyboardSafeAreaView = ({ style, children, testID }: React.PropsWithChildren<Props>) => {
  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }))

  return (
    <Animated.View style={[styles.outer, style, animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  )
}

export default HoliKeyboardSafeAreaView

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
})
