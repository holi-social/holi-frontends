import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Props } from './types'

/**
 * @description this is Android version. It just follows the same API as the iOS and Web version.
 * But because the default behavior of Android is to resize the view when the keyboard is shown, we don't need to do anything here.
 */
const HoliKeyboardSafeAreaView = ({ style, children, testID }: React.PropsWithChildren<Props>) => (
  <View style={[styles.outer, style]} testID={testID}>
    {children}
  </View>
)

export default HoliKeyboardSafeAreaView

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
})
