import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

interface Props {
  placeholderHeight: number
  // below fold = top edge of component is below lower window edge
  // negative means below fold, positive means partially visible
  // default = -200 (a bit negative to already load content next-up)
  belowFoldThreshold?: number
}

// TODO also check visibility when other components re-render and change height, causing children to maybe be visible
const ScrollBasedRender = ({ placeholderHeight, belowFoldThreshold = -200, children }: PropsWithChildren<Props>) => {
  const styles = getStyles(placeholderHeight)
  const [showChildren, setShowChildren] = useState(false)
  const placeholderRef = useRef<View>(null)
  const { height: windowHeight } = useWindowDimensions()

  // initial & re-render based check for visibility
  useEffect(() => {
    // react native only returns zeros when we ask too early -_-
    setTimeout(() => {
      placeholderRef.current?.measure((x, y, width, height, pageX, pageY) => {
        // TODO remove comment:
        // console.log(showChildren, x, y, width, height, pageX, pageY, windowHeight, windowHeight - pageY)
        if (showChildren) {
          // short circuit when previous call already triggered
          return
        }

        const distanceBelowFold = windowHeight - pageY
        if (distanceBelowFold > belowFoldThreshold) {
          setShowChildren(true)
          // TODO remove comment:
          // console.log('rendering with', distanceBelowFold)
        } else {
          // TODO remove comment:
          // console.log(distanceBelowFold)
        }
      })
    }, 0)
  }, [showChildren, windowHeight, belowFoldThreshold])

  // TODO scroll based check for visibility

  // TODO remove comment:
  // const doRender = useCallback(() => setRender(true), [])

  if (showChildren) {
    return <>{children}</>
  } else {
    // TODO use actual loading skeleton (without resetting the animation and without render overhead of the animation offscreen)
    // TODO maybe use onLayout to reduce flicker by having early above the fold detection
    return <View ref={placeholderRef} style={styles.placeholder} collapsable={false} />
  }
}

export default ScrollBasedRender

const getStyles = (placeholderHeight: number) =>
  StyleSheet.create({
    placeholder: {
      height: placeholderHeight,
      backgroundColor: 'red',
    },
  })
