import { useAtomValue } from 'jotai'
import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'

import { mobileScrollYAtom } from '@holi/core/helpers'

// a bit negative to already load content next-up
const DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD = -200

const DEFAULT_PLACEHOLDER_HEIGHT = 350

interface Props {
  // below fold = top edge of component is below lower window edge
  // negative means below fold, positive means partially visible
  // default = -200
  belowFoldThreshold?: number
  // default = <View style={{ height: 350 }} />
  placeholder?: React.ReactNode
}

// disclaimer: we don't detect when other components re-render and change height, causing children to maybe be visible
const ScrollBasedRender = ({
  belowFoldThreshold = DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD,
  placeholder,
  children,
}: PropsWithChildren<Props>) => {
  const [showChildren, setShowChildren] = useState(false)
  const placeholderRef = useRef<View>(null)
  const { height: windowHeight } = useWindowDimensions()

  // scroll based check for visibility
  const scrollY = useAtomValue(mobileScrollYAtom)

  // initial & re-render based check for visibility
  useEffect(() => {
    // react native only returns zeros when we ask too early -_-
    setTimeout(() => {
      placeholderRef.current?.measure((x, y, width, height, pageX, pageY) => {
        if (showChildren) {
          // short circuit when previous call already triggered
          return
        }

        const distanceBelowFold = windowHeight - pageY
        if (distanceBelowFold > belowFoldThreshold) {
          setShowChildren(true)
        }
      })
    }, 0)
  }, [showChildren, windowHeight, belowFoldThreshold, scrollY])

  const wrappedPlaceholder = useMemo(
    () => (
      <View ref={placeholderRef} collapsable={false}>
        {placeholder ?? <View style={{ height: DEFAULT_PLACEHOLDER_HEIGHT }} />}
      </View>
    ),
    [placeholderRef, placeholder]
  )

  if (showChildren) {
    return <>{children}</>
  } else {
    return wrappedPlaceholder
  }
}

export default ScrollBasedRender
