import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewProps, ViewStyle, useWindowDimensions } from 'react-native'

import { isWebTouchDevice, useKeyboard, useSoftKeyboard } from '@holi/ui/helper'
import { colors, vars } from '@holi/ui/styles/globalVars'

import HoliText from '../atoms/HoliText'
import HoliButton from '../molecules/HoliButton'

/**
 * This component makes sure, that
 * it's height always fits in the space
 * above the keyboard.
 * It shrinks, when the keyboard is open
 * and enlarges again on closing keyboard.
 */

export type HoliKeyboardSaveViewProps = {
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  bottomContent?: React.ReactNode
  onHeightChange?: (newHeight: number) => void
  nativeProps?: ViewProps
  testID?: string
}

const WITHOUT_MAX_HEIGHT = 10000

const HoliKeyboardSaveView = ({
  style,
  contentStyle,
  bottomContent,
  onHeightChange = () => null,
  nativeProps,
  testID,
  children,
}: React.PropsWithChildren<HoliKeyboardSaveViewProps>) => {
  const { height: screenHeight } = useWindowDimensions()
  const { isKeyboardOpen, keyboardHeight } = useKeyboard()
  const { isSoftkeyboardOpen, viewPortHeight } = useSoftKeyboard()
  const scrollViewRef = useRef<View>(null)
  const [offsetTop, setOffsetTop] = useState(0)
  const [maxHeight, setMaxHeight] = useState(WITHOUT_MAX_HEIGHT)
  const bottomBarOffset = 97

  const storeOffsetTop = useCallback(
    (offsetTopFromElement?: number) => {
      const isInitialCall = offsetTop === 0
      if (isInitialCall) {
        if (isKeyboardOpen || isSoftkeyboardOpen) return
        if (offsetTopFromElement) {
          setOffsetTop(offsetTopFromElement + 97)
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

  console.log(calcMaxHeight, viewPortHeight)

  return (
    <>
      <View
        {...nativeProps}
        ref={scrollViewRef}
        style={[styles.outer, style, { maxHeight: maxHeight }]}
        testID={testID}
      >
        <View onLayout={(event) => storeOffsetTop(event.nativeEvent?.layout?.top)} style={[styles.inner, contentStyle]}>
          {children}
        </View>
      </View>
      {/* {bottomContent && isKeyboardOpen && <View style={styles.bottomBar}>{bottomContent}</View>} */}
      {
        <View
          style={{
            position: 'fixed',
            bottom: 97,
            backgroundColor: colors.background10,
            borderTopColor: colors.background30,
            borderTopWidth: 1,
            paddingVertical: 15,
            alignItems: 'flex-end',
          }}
        >
          <HoliButton variant="small" label="" style={{ width: 100, marginRight: 15 }}>
            Save
          </HoliButton>
        </View>
      }
    </>
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
    bottom: 97,
  },
})
