import { BorderRadius, Spacing, type SpacingSize } from 'holi-bricks/tokens'

export type SizeToEdge =
  | SpacingSize
  | {
      top?: SpacingSize
      bottom?: SpacingSize
      left?: SpacingSize
      right?: SpacingSize
    }

export type RadiusToEdge =
  | BorderRadius
  | {
      topLeft?: BorderRadius
      topRight?: BorderRadius
      bottomLeft?: BorderRadius
      bottomRight?: BorderRadius
    }

const makeEdgeSpacing = (type: 'padding' | 'margin', size?: SizeToEdge) => {
  if (!size) return {}

  if (typeof size === 'string') {
    const spacingValue = Spacing[size]
    return {
      [`${type}Top`]: spacingValue,
      [`${type}Bottom`]: spacingValue,
      [`${type}Left`]: spacingValue,
      [`${type}Right`]: spacingValue,
    }
  }

  return {
    ...(size.top && { [`${type}Top`]: Spacing[size.top] }),
    ...(size.bottom && { [`${type}Bottom`]: Spacing[size.bottom] }),
    ...(size.left && { [`${type}Left`]: Spacing[size.left] }),
    ...(size.right && { [`${type}Right`]: Spacing[size.right] }),
  }
}

export const makePadding = (padding?: SizeToEdge) => makeEdgeSpacing('padding', padding)
export const makeMargin = (margin?: SizeToEdge) => makeEdgeSpacing('margin', margin)

export const makeRadius = (borderRadius?: RadiusToEdge) => {
  if (!borderRadius) return {}

  if (typeof borderRadius === 'string') {
    const radiusValue = BorderRadius[borderRadius]
    return {
      borderTopLeftRadius: radiusValue,
      borderTopRightRadius: radiusValue,
      borderBottomLeftRadius: radiusValue,
      borderBottomRightRadius: radiusValue,
    }
  }

  return {
    ...(borderRadius.topLeft && { borderTopLeftRadius: BorderRadius[borderRadius.topLeft] }),
    ...(borderRadius.topRight && { borderTopRightRadius: BorderRadius[borderRadius.topRight] }),
    ...(borderRadius.bottomLeft && { borderBottomLeftRadius: BorderRadius[borderRadius.bottomLeft] }),
    ...(borderRadius.bottomRight && { borderBottomRightRadius: BorderRadius[borderRadius.bottomRight] }),
  }
}
