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
  // useWindowDimensions causes more renders than just the breakpoint jumps,
  // but that's ok! don't try to debounce this via useEffect, it doesn't work!
  const { width: windowWidth } = useWindowDimensions()

  // this sorts in place (side effect), but that's ok,
  // because it's the same array again and again
  breakpointValues.sort(([a], [b]) => b - a)

  const matchBreakpoint = breakpointValues.find(([br]) => windowWidth >= br)
  return matchBreakpoint ? matchBreakpoint[1] : undefined
}
