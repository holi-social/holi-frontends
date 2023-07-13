/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { Animated, Easing, View } from 'react-native'

export const SpinningIconContainer: React.FC<{
  children: React.ReactElement
  spinning?: boolean
  testID?: string
}> = ({ children, spinning = true, testID }) => {
  if (spinning) {
    const spinValue = new Animated.Value(0)
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start(() => {
      spinValue.setValue(0)
    })
    return (
      <Animated.View testID={testID} style={{ ...(spinning && { transform: [{ rotate: spin }] }) }}>
        {children}
      </Animated.View>
    )
  }

  return <View testID={testID}>{children}</View>
}
