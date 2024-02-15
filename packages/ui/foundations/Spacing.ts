enum Spacing {
  xxxXs = 4,
  xxXs = 8,
  xXs = 12,
  Xs = 16,
  Sm = 20,
  Md = 24,
  Lg = 32,
  Xl = 40,
  xXL = 48,
  xxXL = 56,
  xxxXL = 64,
}

export type SpacingSize = keyof typeof Spacing

export default Spacing
