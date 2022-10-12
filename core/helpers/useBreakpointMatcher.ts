import { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { vars } from '@holi/ui/styles/globalVars'

const defaultBreakpointGridValues: [number, unknown][] = [
  [0, 1],
  [+vars.breakpointL, 2],
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useBreakpointMatcher = (breakpointValues: [number, any][] = defaultBreakpointGridValues) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState<any>()
  const { width: screenWidth } = useWindowDimensions()

  useEffect(() => {
    breakpointValues.sort(([a], [b]) => b - a)
    const machtBreakpoint = breakpointValues.find(([br]) => screenWidth >= br)
    if (!!machtBreakpoint && value !== machtBreakpoint[1]) {
      setValue(machtBreakpoint[1])
    }
  }, [value, screenWidth, breakpointValues])

  return value
}
