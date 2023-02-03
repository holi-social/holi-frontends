import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewProps, ViewStyle, useWindowDimensions } from 'react-native'

import { isWebTouchDevice, useKeyboard, useSoftKeyboard } from '@holi/ui/helper'

/**
 * This component makes sure, that
 * it's height always fits in the space
 * above the keyboard.
 * It shrinks, when the keyboard is open
 * and enlarges again on closing keyboard.
 */

export type HoliKeyboardSaveViewProps = {
  style?: StyleProp<ViewStyle>
  bottomContent?: React.ReactNode
  onHeightChange?: (newHeight: number) => void
  nativeProps?: ViewProps
  testID?: string
}

const WITHOUT_MAX_HEIGHT = 10000

const HoliKeyboardSaveView: React.FC<HoliKeyboardSaveViewProps> = ({
  style,
  bottomContent,
  onHeightChange = () => null,
  nativeProps,
  testID,
  children,
}) => {
  const { height: screenHeight } = useWindowDimensions()
  const { keyboardIsOpen, keyboardHeight } = useKeyboard()
  const { softkeyboardIsOpen, viewPortHeight } = useSoftKeyboard()
  const scrollViewRef = useRef<View>(null)
  const [offsetTop, setOffsetTop] = useState(0)
  const [maxHeight, setMaxHeight] = useState(WITHOUT_MAX_HEIGHT)

  const calcMaxHeight = useCallback(() => {
    if (Platform.OS === 'web' && !isWebTouchDevice()) return
    const maxViewPort = Platform.OS === 'web' ? viewPortHeight : screenHeight - keyboardHeight
    const newViewHeight = maxViewPort - offsetTop
    setMaxHeight(newViewHeight)
    onHeightChange(newViewHeight)
    storeOffsetTop()

    // Adding viewHeight here would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardHeight, viewPortHeight, screenHeight])

  const storeOffsetTop = (offsetTopFromElement?: number) => {
    const isInitialCall = offsetTop === 0
    if (isInitialCall) {
      if (keyboardIsOpen || softkeyboardIsOpen) return
      if (offsetTopFromElement) {
        setOffsetTop(offsetTopFromElement)
      }
    }
  }

  useEffect(calcMaxHeight, [viewPortHeight, calcMaxHeight])

  return (
    <View {...nativeProps} ref={scrollViewRef} style={[styles.outer, style, { maxHeight: maxHeight }]} testID={testID}>
      <View onLayout={(event) => storeOffsetTop(event.nativeEvent?.layout?.top)} style={styles.inner}>
        {children}
      </View>
      {bottomContent && <View style={styles.bottomBar}>{bottomContent}</View>}
    </View>
  )
}

export default HoliKeyboardSaveView

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  bottomBar: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
})
