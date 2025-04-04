export const BorderWidth = {
  sm: 1,
  md: 2,
  lg: 3,
} as const

export type BorderRadiusSize = keyof typeof BorderWidth
