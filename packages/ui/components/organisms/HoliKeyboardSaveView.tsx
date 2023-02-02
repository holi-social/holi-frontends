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
  testID?: string
  nativeProps?: ViewProps
}

const NO_MAX_HEIGHT = 10000

const HoliKeyboardSaveView: React.FC<HoliKeyboardSaveViewProps> = ({
  style,
  bottomContent,
  testID,
  nativeProps,
  children,
}) => {
  // TODO:
  // 1. set bottom-aligned content into the visible area (e.g. button)
  // 2. scroll the focussed element into the visible area (get current focus)

  const { height: screenHeight } = useWindowDimensions()
  const { keyboardIsOpen, keyboardHeight } = useKeyboard()
  const { softkeyboardIsOpen, viewPortHeight } = useSoftKeyboard()
  const scrollViewRef = useRef<View>(null)
  const [viewHeight, setViewHeight] = useState(0)
  const [offsetTop, setOffsetTop] = useState(0)
  const [maxHeight, setMaxHeight] = useState(NO_MAX_HEIGHT)

  const calMaxHeight = useCallback(() => {
    storeOffsetTop()

    const maxViewPort = Platform.OS === 'web' ? viewPortHeight : screenHeight - keyboardHeight
    if (viewHeight > maxViewPort) {
      const newViewHeight = maxViewPort - offsetTop
      setMaxHeight(newViewHeight)
    } else {
      setMaxHeight(screenHeight)
    }
    // Adding viewHeight here would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardHeight, viewPortHeight, screenHeight])

  const storeOffsetTop = () => {
    const isInitialCall =
      Platform.OS === 'web'
        ? offsetTop === 0 && maxHeight !== NO_MAX_HEIGHT && !keyboardIsOpen && !softkeyboardIsOpen
        : offsetTop === 0 && viewHeight !== 0 && !keyboardIsOpen && !softkeyboardIsOpen
    if (isInitialCall) {
      const realViewPort = Platform.OS === 'web' ? viewPortHeight : screenHeight
      setOffsetTop(realViewPort - viewHeight)
    }
  }

  const storeViewHeight = (event: LayoutChangeEvent) => {
    setViewHeight(event.nativeEvent?.layout?.height)
    storeOffsetTop()
  }

  useEffect(calMaxHeight, [viewPortHeight, calMaxHeight])

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
