import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import { useKeyboard, useSoftKeyboard } from '@holi/ui/helper'

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

const NO_MAX_HEIGHT = 10000

const HoliKeyboardSaveView: React.FC<HoliKeyboardSaveViewProps> = ({
  style,
  bottomContent,
  onHeightChange = () => null,
  nativeProps,
  testID,
  children,
}) => {
  // TODO:
  // 1. set bottom-aligned content into the visible area (e.g. button)
  // 2. scroll the focussed element into the visible area (get current focus)

  const { height: screenHeight } = useWindowDimensions()
  const { keyboardIsOpen, keyboardHeight } = useKeyboard()
  const { softkeyboardIsOpen, viewPortHeight } = useSoftKeyboard()
  const scrollViewRef = useRef<View>(null)
  // const [viewHeight, setViewHeight] = useState(0)
  const [offsetTop, setOffsetTop] = useState(0)
  const [maxHeight, setMaxHeight] = useState(NO_MAX_HEIGHT)

  const calcMaxHeight = useCallback(() => {
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

  const storeViewHeight = (event: LayoutChangeEvent) => {
    // console.log('view layout:', event.nativeEvent?.layout)
    // setViewHeight(event.nativeEvent?.layout?.height)
    storeOffsetTop(event.nativeEvent?.layout?.top)
  }

  useEffect(calcMaxHeight, [viewPortHeight, calcMaxHeight])

  return (
    <View {...nativeProps} ref={scrollViewRef} style={[styles.outer, style, { maxHeight: maxHeight }]} testID={testID}>
      <View onLayout={storeViewHeight} style={{ flex: 1 }}>
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
  bottomBar: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
})
