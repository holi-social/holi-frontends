import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const ReanimatedExample = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
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
        label="Beschreibung"
        onPress={() => {
          cancel()
          offset.value = Math.random()
        }}
      >
        Move
      </HoliButton>
    </View>
  )
}

export default ReanimatedExample

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.brandColorB30,
      borderStyle: 'solid',
    },
    box: {
      width: 100,
      height: 100,
      backgroundColor: theme.colors.brandColorB30,
      borderRadius: 10,
      marginBottom: 10,
    },
  })
