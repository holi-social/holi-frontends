import { useContext } from 'react'

import { ScrollYHandlerContext, ScrollYValueContext } from '@holi/core/provider/ScrollYProvider'

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
