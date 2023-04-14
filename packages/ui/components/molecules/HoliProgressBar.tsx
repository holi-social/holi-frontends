import React, { useEffect, useRef } from 'react'
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type HoliProgressBarProps = {
  progress: number
  isSmall?: boolean
  testID?: string
  barStyle?: StyleProp<ViewStyle>
  progressStyle?: StyleProp<ViewStyle>
}

const HoliProgressBar: React.FC<HoliProgressBarProps> = ({
  progress = 0,
  isSmall = false,
  testID,
  barStyle,
  progressStyle,
}) => {
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

  return (
    <View testID={testID} style={[styles.bar, barStyle, isSmall && { height: 6 }]}>
      <Animated.View style={[styles.progress, progressStyle, isSmall && { height: 6 }, { width: widthAnimValue }]} />
    </View>
  )
}

export default HoliProgressBar

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background10,
    height: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.background30,
    width: '100%',
  },
  progress: {
    borderColor: colors.brandColorC30,
    borderWidth: 1,
    borderRadius: 6,
    minWidth: 12,
    height: 12,
    backgroundColor: colors.brandColorC20,
    maxWidth: '100%',
  },
})
