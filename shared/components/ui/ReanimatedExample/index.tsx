import { buildExecutionContext } from 'graphql/execution/execute'
import React, { useState, RefObject, createRef, useCallback } from 'react'
import { StyleSheet, View, Button } from 'react-native'
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated'
import theme from 'shared/styles/theme/theme'



function ReanimatedExample() {
  const offset = useSharedValue(0)

  const defaultSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(offset.value * 255) }],
    }
  })

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value * 255, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    }
  })

  const cancel = () => {
    cancelAnimation(offset)
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, defaultSpringStyles]} />
      <Animated.View style={[styles.box, customSpringStyles]} />
      <Button onPress={() => {cancel(); offset.value = Math.random()}} title="Move" />
    </View>
  )
}

export default ReanimatedExample

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'blue',
    borderStyle: 'solid',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    marginBottom: 10,
  },
})
