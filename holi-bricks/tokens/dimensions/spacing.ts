export const Spacing = {
  '5xs': 2,
  '4xs': 4,
  '3xs': 8,
  xxs: 12,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  '3xl': 56,
  '4xl': 64,
} as const

export type SpacingSize = keyof typeof Spacing
