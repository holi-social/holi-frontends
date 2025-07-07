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

export type SizeToEdge =
  | SpacingSize
  | {
      top?: SpacingSize
      bottom?: SpacingSize
      left?: SpacingSize
      right?: SpacingSize
    }

export type LayoutProps = {
  margin?: SizeToEdge
}

type Margins = {
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
}

type Paddings = {
  padding?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
}

const sizeToEdgeSpacing = (type: 'padding' | 'margin', size?: SizeToEdge): Margins | Paddings => {
  if (!size) return {}

  if (typeof size === 'string') {
    const spacingValue = Spacing[size]
    return {
      [type]: spacingValue,
    }
  }

  return {
    ...(size.top && { [`${type}Top`]: Spacing[size.top] }),
    ...(size.bottom && { [`${type}Bottom`]: Spacing[size.bottom] }),
    ...(size.left && { [`${type}Left`]: Spacing[size.left] }),
    ...(size.right && { [`${type}Right`]: Spacing[size.right] }),
  }
}

export const makePadding = (padding?: SizeToEdge) => sizeToEdgeSpacing('padding', padding) as Paddings
export const makeMargin = (margin?: SizeToEdge) => sizeToEdgeSpacing('margin', margin) as Margins

export const layoutStyle = (props: LayoutProps) => {
  return makeMargin(props.margin)
}
