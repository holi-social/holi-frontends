import React, { createContext, useCallback, useContext, useState } from 'react'
import { NativeScrollEvent } from 'react-native'

const ScrollYValueContext = createContext(0)
const ScrollYHandlerContext = createContext<(event: { nativeEvent: NativeScrollEvent }) => void>(() => null)

export const ScrollYProvider: React.FC = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)

  const onScroll = useCallback(
    (event: { nativeEvent: NativeScrollEvent }) => {
      setScrollY(event.nativeEvent?.contentOffset?.y ?? 0)
    },
    [setScrollY]
  )

  return (
    <ScrollYValueContext.Provider value={scrollY}>
      <ScrollYHandlerContext.Provider value={onScroll}>{children}</ScrollYHandlerContext.Provider>
    </ScrollYValueContext.Provider>
  )
}

export const useScrollYValue = () => {
  const scrollY = useContext(ScrollYValueContext)

  if (scrollY == undefined) {
    throw new Error('useScrollYValue() must be used within a ScrollYProvider')
  }

  return scrollY
}

export const useScrollYHandler = () => {
  const onScroll = useContext(ScrollYHandlerContext)

  if (onScroll == undefined) {
    throw new Error('useScrollYSetter() must be used within a ScrollYProvider')
  }

  return onScroll
}
