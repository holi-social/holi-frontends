import React, { useEffect } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { dimensions } from '@holi/ui/styles/globalVars'

import { Props } from './types'

/**
 * @description this is Web version. It uses 'useWindowDimensions()' hookthat reacts on soft keyboard open
 * and adjusts the 'maxHeight' of the wrapper component to shrink it to the view.
 */
const HoliKeyboardSafeAreaView = ({ style, children, testID }: React.PropsWithChildren<Props>) => {
  const { height: screenHeight } = useWindowDimensions()
  const { headerTransparent } = useScreenOptions()

  const maxHeight = headerTransparent ? screenHeight : screenHeight - dimensions.topBarHeight

  useEffect(() => {
    window?.scroll?.(0, 0)
  }, [screenHeight])

  return (
    <View style={[styles.outer, style, { maxHeight }]} testID={testID}>
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
