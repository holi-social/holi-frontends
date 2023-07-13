import { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { vars } from '@holi/ui/styles/globalVars'

const defaultBreakpointGridValues: [number, number][] = [
  [0, 1],
  [+vars.breakpointL, 2],
]

/*
  useBreakpointMatcher() hook expects array of tuples

  First value in tuple is breakpoint value (e.g. 768 | 1024 | 1280)
  Second value in tuple could be some possible value for Style prop or even a complete Style object
  For now we just use numbers; adapt this, if you need anything else

  useBreakpointMatcher() finds the highest suitable breakpoint and returns its value (second element in tuple)
*/
export const useBreakpointMatcher = (
  breakpointValues: [number, number][] = defaultBreakpointGridValues
): number | undefined => {
  const [value, setValue] = useState<number>()
  const { width: screenWidth } = useWindowDimensions()

  useEffect(() => {
    breakpointValues.sort(([a], [b]) => b - a)
    const matchBreakpoint = breakpointValues.find(([br]) => screenWidth >= br)
    if (!!matchBreakpoint && value !== matchBreakpoint[1]) {
      setValue(matchBreakpoint[1])
    }
  }, [value, screenWidth, breakpointValues])

  return value
}
