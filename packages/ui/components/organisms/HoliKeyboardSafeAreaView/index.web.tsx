import React, { useEffect } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { Props } from './types'

/**
 * @description this is Web version. It uses 'useWindowDimensions()' hookthat reacts on soft keyboard open
 * and adjusts the 'maxHeight' of the wrapper component to shrink it to the view.
 */
const HoliKeyboardSafeAreaView = ({ style, children, testID }: React.PropsWithChildren<Props>) => {
  const { height: screenHeight } = useWindowDimensions()

  useEffect(() => {
    window?.scroll?.(0, 0)
  }, [screenHeight])

  return (
    <View style={[styles.outer, style, { maxHeight: screenHeight }]} testID={testID}>
      {children}
    </View>
  )
}

export default HoliKeyboardSafeAreaView

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    flex: 1,
  },
})
