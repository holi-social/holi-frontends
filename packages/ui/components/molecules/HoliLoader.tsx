import React, { useCallback, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
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

const HoliLoader: React.VFC<HoliLoaderProps> = ({ style, testID }) => {
  const loader = (
    <View style={styles.loader}>
      <HoliLottie animType="loader" />
    </View>
  )

  const Wrapper = Platform.OS === 'web' ? View : Animated.View

  return (
    <Wrapper style={[styles.loaderContainer, style]} entering={FadeIn} exiting={FadeOut.delay(300)} testID={testID}>
      {loader}
    </Wrapper>
  )
}

export default HoliLoader

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  loader: {
    height: 64,
    width: 64,
  },
})
