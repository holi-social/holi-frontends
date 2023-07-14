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
  initOffsetTop?: number
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  onHeightChange?: (newHeight: number) => void
  nativeProps?: ViewProps
  testID?: string
}

const WITHOUT_MAX_HEIGHT = 10000

const HoliKeyboardSaveView = ({
  initOffsetTop = 0,
  style,
  contentStyle,
  onHeightChange = () => null,
  nativeProps,
  testID,
  children,
}: React.PropsWithChildren<HoliKeyboardSaveViewProps>) => {
  const { height: screenHeight } = useWindowDimensions()
  const { isKeyboardOpen, keyboardHeight } = useKeyboard()
  const { isSoftkeyboardOpen, viewPortHeight } = useSoftKeyboard()
  const scrollViewRef = useRef<View>(null)
  const [offsetTop, setOffsetTop] = useState(initOffsetTop)
  const [maxHeight, setMaxHeight] = useState(WITHOUT_MAX_HEIGHT)

  const storeOffsetTop = useCallback(
    (offsetTopFromElement?: number) => {
      const isInitialCall = offsetTop === 0
      if (isInitialCall) {
        if (isKeyboardOpen || isSoftkeyboardOpen) return
        if (offsetTopFromElement) {
          setOffsetTop(offsetTopFromElement)
        }
      }
    },
    [isKeyboardOpen, isSoftkeyboardOpen, offsetTop]
  )

  const calcMaxHeight = useCallback(() => {
    if (Platform.OS === 'web' && !isWebTouchDevice()) return
    const maxViewPort = Platform.OS === 'web' ? viewPortHeight : screenHeight - keyboardHeight
    const newViewHeight = maxViewPort - offsetTop

    if (maxViewPort <= 0 || newViewHeight <= 0) return

    setMaxHeight(newViewHeight)
    onHeightChange(newViewHeight)
    storeOffsetTop()
  }, [keyboardHeight, viewPortHeight, screenHeight, onHeightChange, offsetTop, storeOffsetTop])

  useEffect(calcMaxHeight, [viewPortHeight, calcMaxHeight])

  return (
    <View {...nativeProps} ref={scrollViewRef} style={[styles.outer, style, { maxHeight: maxHeight }]} testID={testID}>
      <View onLayout={(event) => storeOffsetTop(event.nativeEvent?.layout?.top)} style={[styles.inner, contentStyle]}>
        {children}
      </View>
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
})
