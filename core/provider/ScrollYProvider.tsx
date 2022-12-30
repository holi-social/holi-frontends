import React, { createContext, useCallback, useState } from 'react'
import { NativeScrollEvent } from 'react-native'

export const ScrollYValueContext = createContext(0)
export const ScrollYHandlerContext = createContext<(event: { nativeEvent: NativeScrollEvent }) => void>(() => null)

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
