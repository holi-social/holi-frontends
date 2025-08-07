import type { FlexStyle } from 'react-native'
import StyleSheet from 'react-native-media-query'

import { breakpoints } from 'holi-bricks/foundations'

export interface GridStyles extends ResponsiveWidthStyle {
  readonly padding: FlexStyle['padding']
}

export type Breakpoints = [number, number][]
export type MediaIds = Record<string | number | symbol, string>

interface WidthStyleProp {
  readonly width?: FlexStyle['width']
}

interface ResponsiveWidthStyle extends WidthStyleProp {
  [key: `@media${string}`]: {
    readonly width?: WidthStyleProp
  }
}

export const defaultGridBreakpoints: [number, number][] = [
  [0, 1],
  [breakpoints.lg, 2],
]

export const createResponsiveWidth = (breakpoints: Breakpoints): ResponsiveWidthStyle => {
  return breakpoints.reduce((styles: ResponsiveWidthStyle, item: [number, number]) => {
    const [bp, value] = item
    const styleProp: WidthStyleProp = { width: `${100 / value}%` }

    if (bp === 0) return Object.assign(styles, styleProp)

    return Object.assign(styles, {
      [`@media (min-width: ${bp}px)`]: styleProp,
    })
  }, {})
}

export const createGridStyles = (breakpoints: Breakpoints, gap: number) => {
  return StyleSheet.create({
    gridItem: {
      ...createResponsiveWidth(breakpoints),
      padding: gap / 2,
    },
  })
}
