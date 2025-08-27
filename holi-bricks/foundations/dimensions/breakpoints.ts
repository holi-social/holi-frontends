export const breakpoints = {
  xs: 375,
  sm: 576,
  md: 768,
  lg: 840,
  xl: 1200,
  xxl: 1920,
} as const

export type BreakpointsSize = keyof typeof breakpoints
