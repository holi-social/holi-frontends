import { StyleSheet } from 'react-native'

export type BoxSpace = number | TupleBoxSpace | BoundingBoxSpace
export type TupleBoxSpace = [number, number]
export type BoundingBoxSpace = [number, number, number, number]
export type PaddingProperty =
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingVertical'
  | 'paddingHorizontal'

export interface NamedPaddingStyle {
  readonly boxPadding: {
    readonly padding: BoxSpace
  }
}

export const isBoxSpace = (value: number | number[]): value is BoxSpace => {
  if (typeof value === 'number') return true
  if (!Array.isArray(value)) return false
  if (value.length === 2) return true
  if (value.length === 4) return true

  return false
}

export const isTupleBoxSpace = (value: number | number[]): value is TupleBoxSpace => {
  if (!Array.isArray(value)) return false
  if (value.length === 2) return true
  return false
}

export const isBoundingBoxSpace = (value: number | number[]): value is BoundingBoxSpace => {
  if (!Array.isArray(value)) return false
  if (value.length === 4) return true
  return false
}

const maybeSetPaddingProperty = (property: PaddingProperty, value: number) => (value > 0 ? { [property]: value } : null)

export function createBoxPadding(padding: number | number[]): StyleSheet.NamedStyles<NamedPaddingStyle> | null {
  if (!isBoxSpace(padding)) return null

  if (isTupleBoxSpace(padding)) {
    const verticalValues = padding[0]
    const horizontalValues = padding[1]

    return StyleSheet.create({
      boxPadding: {
        ...maybeSetPaddingProperty('paddingVertical', verticalValues),
        ...maybeSetPaddingProperty('paddingHorizontal', horizontalValues),
      },
    })
  }

  if (isBoundingBoxSpace(padding)) {
    const top = padding[0]
    const right = padding[1]
    const bottom = padding[2]
    const left = padding[3]

    return StyleSheet.create({
      boxPadding: {
        ...maybeSetPaddingProperty('paddingTop', top),
        ...maybeSetPaddingProperty('paddingRight', right),
        ...maybeSetPaddingProperty('paddingBottom', bottom),
        ...maybeSetPaddingProperty('paddingLeft', left),
      },
    })
  }

  return StyleSheet.create({ boxPadding: { padding: padding } })
}
