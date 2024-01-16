import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const useProgressBar = (progress: number) => {
  const widthAnim = useRef(new Animated.Value(progress)).current
  const widthAnimValue = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  // Animate on `progress` prop change
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress, widthAnim])

  return {
    progressWidth: widthAnimValue,
  }
}
