import type { PropsWithChildren } from 'react'
import React, { createContext, useContext } from 'react'
import { View } from 'react-native'
import StyleSheet from 'react-native-media-query'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import {
  type Breakpoints,
  type GridStyles,
  createGridStyles,
  defaultGridBreakpoints,
} from '@holi/ui/components/utils/gridStyles'

export interface HoliGridWrapperProps {
  gap?: number
  breakpoints?: Breakpoints
}

interface GridContextValue {
  styles: GridStyles
  id: string
}

const { styles: defaultGridStyles, ids: defaultIds } = createGridStyles(defaultGridBreakpoints, 24)

const GridContext = createContext<GridContextValue>({
  styles: defaultGridStyles.gridItem,
  id: defaultIds.gridItem,
})

export const useGrid = () => {
  const context = useContext(GridContext)

  if (context === undefined) {
    throw new HoliError('useGrid() must be used within a GridProvider')
  }

  return context
}

const GridProvider = ({ children, ...value }: React.PropsWithChildren<GridContextValue>) => {
  return <GridContext.Provider value={value}>{children}</GridContext.Provider>
}

const HoliGridWrapper = ({
  children,
  gap = 24,
  breakpoints = defaultGridBreakpoints,
}: PropsWithChildren<HoliGridWrapperProps>) => {
  const { styles: gridStyles, ids } = createGridStyles(breakpoints, gap)

  return (
    <View style={styles.outer}>
      <View style={[styles.wrapper, { margin: -gap / 2 }]}>
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
