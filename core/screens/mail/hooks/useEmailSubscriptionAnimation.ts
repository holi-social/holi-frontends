import { useRef } from 'react'
import { Animated } from 'react-native'

interface AnimationValues {
  fadeAnim: Animated.Value
  animateTransition: (callback: () => void) => void
}

export const useEmailSubscriptionAnimation = (): AnimationValues => {
  const fadeAnim = useRef(new Animated.Value(1)).current

  const animateTransition = (callback: () => void) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      callback()
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start()
    })
  }

  return {
    fadeAnim,
    animateTransition,
  }
}
