import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import HoliButton from '@holi/ui/components/HoliButton'
import theme from '@holi/ui/styles/theme/theme'

const ReanimatedExample = () => {
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
      <HoliButton
        onPress={() => {
          cancel()
          offset.value = Math.random()
        }}
        title="Move"
      />
    </View>
  )
}

export default ReanimatedExample

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.secondaryColor,
    borderStyle: 'solid',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.secondaryColor,
    borderRadius: 10,
    marginBottom: 10,
  },
})
