import React, { useCallback, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import HoliLottie from '@holi/ui/components/atoms/HoliLottie'

export interface HoliLoaderProps {
  style?: StyleProp<ViewStyle>
  testID?: string
}

export const useLoader = () => {
  const [isLoaderShown, setIsLoaderShown] = useState(false)

  const showLoader = useCallback(() => setIsLoaderShown(true), [])
  const hideLoader = useCallback(() => setIsLoaderShown(false), [])

  return {
    isLoaderShown,
    showLoader,
    hideLoader,
  }
}

const HoliLoader: React.FC<HoliLoaderProps> = ({ style, testID }) => {
  return (
    <Animated.View
      style={[styles.loaderContainer, style]}
      entering={FadeIn.delay(300)}
      exiting={FadeOut.duration(500)}
      testID={testID}
    >
      <View style={styles.loader}>
        <HoliLottie animType="loader" />
      </View>
    </Animated.View>
  )
}

export default HoliLoader

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  loader: {
    height: 64,
    width: 64,
  },
})
