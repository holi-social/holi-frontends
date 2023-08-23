import { useAtomValue } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'

import {
  DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD,
  DEFAULT_PLACEHOLDER_HEIGHT,
  ScrollBasedCallbackInvocationProps,
} from '@holi/core/components/ScrollBasedCallbackInvocation.shared'
import { mobileScrollYAtom } from '@holi/core/helpers'

const ScrollBasedCallbackInvocation = ({
  belowFoldThreshold = DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD,
  placeholder,
  callback,
}: ScrollBasedCallbackInvocationProps) => {
  const [lastPosition, setLastPosition] = useState(0)
  const placeholderRef = useRef<View>(null)
  const { height: windowHeight } = useWindowDimensions()

  // scroll-based check for visibility
  const scrollY = useAtomValue(mobileScrollYAtom)

  // initial & re-render based check for visibility
  useEffect(() => {
    // react native only returns zeros when we ask too early -_-
    setTimeout(() => {
      placeholderRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const distanceBelowFold = windowHeight - pageY
        if (lastPosition >= distanceBelowFold) {
          // short circuit when previous call already triggered
          return
        }

        if (distanceBelowFold > belowFoldThreshold) {
          setLastPosition(distanceBelowFold + belowFoldThreshold)
          callback()
        }
      })
    }, 0)
  }, [windowHeight, belowFoldThreshold, scrollY, callback, lastPosition])

  return (
    <View ref={placeholderRef} collapsable={false}>
      {placeholder ?? <View style={{ height: DEFAULT_PLACEHOLDER_HEIGHT }} />}
    </View>
  )
}

export default ScrollBasedCallbackInvocation
