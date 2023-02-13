import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { colors } from '@holi/ui/styles/globalVars'

const HoliLoader: React.VFC = () => {
  const loader = (
    <View style={styles.loader}>
      <HoliLottie animType="loader" />
    </View>
  )

  const Wrapper = Platform.OS === 'web' ? View : Animated.View

  return (
    <Wrapper style={styles.loaderContainer} entering={FadeIn} exiting={FadeOut.delay(300)}>
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
    backgroundColor: colors.background10,
  },
  loader: {
    height: 64,
    width: 64,
  },
})
