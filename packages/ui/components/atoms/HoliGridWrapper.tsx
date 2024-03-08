import type { PropsWithChildren } from 'react'
import React, { createContext, useContext } from 'react'
import { FlexStyle, View, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-media-query'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { dimensions } from '@holi/ui/styles/globalVars'

export interface HoliGridWrapperProps {
  gap?: number
  itemsInRow?: number
  style?: ViewStyle
  breakpoints?: Breakpoints
}

interface WidthStyleProp {
  width?: FlexStyle['width']
}

interface ResponsiveWidthStyle extends WidthStyleProp {
  [key: `@media${string}`]: {
    width?: FlexStyle['width']
  }
}

interface GridStyles extends ResponsiveWidthStyle {
  padding: FlexStyle['padding']
}

export type Breakpoints = [number, number][]
export type MediaIds = Record<string | number | symbol, string>

const defaultBreakpoints: [number, number][] = [
  [0, 1],
  [dimensions.breakpointL, 2],
]

const createResponsiveWidth = (breakpoints: Breakpoints): ResponsiveWidthStyle => {
  return breakpoints.reduce((styles: ResponsiveWidthStyle, item: [number, number]) => {
    const [bp, value] = item
    const styleProp: WidthStyleProp = { width: `${100 / value}%` }

    if (bp === 0) return Object.assign(styles, styleProp)

    return Object.assign(styles, {
      [`@media (min-width: ${bp}px)`]: styleProp,
    })
  }, {})
}

const createGridStyles = (breakpoints: Breakpoints, gap: number) => {
  return StyleSheet.create({
    gridItem: {
      ...createResponsiveWidth(breakpoints),
      padding: gap / 2,
    },
  })
}

const { styles: defaultGridStyles, ids: defaultIds } = createGridStyles(defaultBreakpoints, 24)

interface GridContextValue {
  styles: GridStyles
  id: string
}

const GridContext = createContext<GridContextValue>({
  styles: defaultGridStyles.gridItem,
  id: defaultIds.gridItem,
})

const GridProvider = ({ children, ...value }: React.PropsWithChildren<GridContextValue>) => {
  return <GridContext.Provider value={value}>{children}</GridContext.Provider>
}

export const useGrid = () => {
  const context = useContext(GridContext)

  if (context === undefined) {
    throw new HoliError('useGrid() must be used within a GridProvider')
  }

  return context
}

const HoliGridWrapper = ({
  children,
  style, // TODO Remove style prop
  gap = 24,
  breakpoints = defaultBreakpoints,
}: PropsWithChildren<HoliGridWrapperProps>) => {
  const { styles: gridStyles, ids } = createGridStyles(breakpoints, gap)

  return (
    <View style={styles.outer}>
      <View style={[style, styles.wrapper, { margin: -gap / 2 }]}>
        <GridProvider id={ids.gridItem} styles={gridStyles.gridItem}>
          {children}
        </GridProvider>
      </View>
    </View>
  )
}

export default HoliGridWrapper

const { styles } = StyleSheet.create({
  outer: {
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
