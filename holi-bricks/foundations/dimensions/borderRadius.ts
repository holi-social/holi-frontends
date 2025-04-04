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

export type BorderRadius = keyof typeof BorderRadius

export type RadiusToEdge =
  | BorderRadius
  | {
      topLeft?: BorderRadius
      topRight?: BorderRadius
      bottomLeft?: BorderRadius
      bottomRight?: BorderRadius
    }

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
