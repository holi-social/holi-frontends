export const BorderRadius = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 1000,
} as const

export type BorderRadiusSize = keyof typeof BorderRadius
