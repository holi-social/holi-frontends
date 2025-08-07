import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { breakpoints } from 'holi-bricks/foundations'

const defaultBreakpointGridValues: [number, number][] = [
  [0, 1],
  [breakpoints.lg, 2],
]

/*
  useBreakpointMatcher() hook expects array of tuples

  First value in tuple is breakpoint value (e.g. 768 | 1024 | 1280)
  Second value in tuple could be some possible value for Style prop or even a complete Style object

  useBreakpointMatcher() finds the highest suitable breakpoint and returns its value (second element in tuple)
*/
export const useBreakpointMatcher = <T = number>(
  breakpointValues: [number, T][] = defaultBreakpointGridValues as [number, T][]
): T | undefined => {
  // useWindowDimensions causes more renders than just the breakpoint jumps,
  // but that's ok! don't try to debounce this via useEffect, it doesn't work!
  const { width: windowWidth } = useClientWindowDimensions()

  // this sorts in place (side effect), but that's ok,
  // because it's the same array again and again
  breakpointValues.sort(([a], [b]) => b - a)

  const matchBreakpoint = breakpointValues.find(([br]) => windowWidth >= br)
  return matchBreakpoint ? matchBreakpoint[1] : undefined
}
