import React, { useCallback, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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
    <View style={[styles.loaderContainer, style]} testID={testID}>
      <View style={styles.loader}>
        <HoliLottie animType="loader" />
      </View>
    </View>
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
