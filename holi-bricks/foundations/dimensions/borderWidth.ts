export const BorderWidth = {
  sm: 1,
  md: 2,
  lg: 3,
} as const

export type BorderWidthSize = keyof typeof BorderWidth

export type BorderSizeToEdge =
  | BorderWidthSize
  | {
      top?: BorderWidthSize
      bottom?: BorderWidthSize
      left?: BorderWidthSize
      right?: BorderWidthSize
    }

const sizeToBorderWidth = (size?: BorderSizeToEdge) => {
  if (!size)
    return {
      borderWidth: 0,
    }

  if (typeof size === 'string') {
    const borderValue = BorderWidth[size]
    return {
      borderWidth: borderValue,
    }
  }

  return {
    ...(size.top && { borderTopWidth: BorderWidth[size.top] }),
    ...(size.bottom && { borderBottomWidth: BorderWidth[size.bottom] }),
    ...(size.left && { borderLeftWidth: BorderWidth[size.left] }),
    ...(size.right && { borderRightWidth: BorderWidth[size.right] }),
  }
}

export const makeBorderWidth = (width?: BorderSizeToEdge) => sizeToBorderWidth(width)
