import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import type { NavigationCustomOptions } from '@holi/core/navigation/hooks/useScreenOptions/types'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import dimensions from '@holi/ui/styles/globalVars/dimensions'

import tinycolor from 'tinycolor2'
import { mono } from 'holi-bricks/foundations'
import GradientBackground from '@holi/core/components/GradientBackground'

type UseScreenComponentInternalArgs = {
  headerOptions?: NavigationCustomOptions
}

export const useScreenComponentInternal = ({ headerOptions }: UseScreenComponentInternalArgs) => {
  const setScreenOptions = useSetScreenOptions()
  const [stickyBottomOffset, setStickyBottomOffset] = useState(0)

  const stickyBottomLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (e.nativeEvent.layout.height !== stickyBottomOffset) setStickyBottomOffset(e.nativeEvent.layout.height)
    },
    [stickyBottomOffset]
  )

  const [stickyTopOffset, setStickyTopOffset] = useState(0)
  const stickyTopLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (e.nativeEvent.layout.height !== stickyTopOffset) setStickyTopOffset(e.nativeEvent.layout.height)
    },
    [stickyTopOffset]
  )

  useEffect(() => {
    if (headerOptions) {
      const headerBg = headerOptions?.headerTransparent
        ? {
            headerBackground: () => {
              const gradientColorStart = tinycolor(mono['800']).setAlpha(0.6).toRgbString()
              const gradientColorEnd = tinycolor(mono['800']).setAlpha(0).toRgbString()
              return <GradientBackground colors={[gradientColorStart, gradientColorEnd]} end={{ x: 0.5, y: 0.9 }} />
            },
          }
        : undefined
      setScreenOptions({ ...headerOptions, ...headerBg })
    }
  }, [headerOptions, setScreenOptions])

  return {
    stickyBottomOffset,
    stickyTopOffset,
    stickyTopLayout,
    headerHeight: Number(dimensions.topBarHeight),
    stickyBottomLayout,
  }
}
