/* eslint-disable @typescript-eslint/no-var-requires */
import React, { createContext, useContext } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

export interface HoliGridWrapperProps {
  gap: number
  itemsInRow: number
  style: ViewStyle
}

interface GridContextValue {
  padding: number
  width: string
}

const GridContext = createContext<GridContextValue>({
  padding: 0,
  width: '100%',
})

const GridProvider: React.FC<GridContextValue> = ({ children, ...value }) => {
  return <GridContext.Provider value={value}>{children}</GridContext.Provider>
}

export const useGrid = () => {
  const context = useContext(GridContext)

  if (context === undefined) {
    throw new Error('useGrid() must be used within a GridProvider')
  }

  return context
}

const HoliGridWrapper: React.FC<Partial<HoliGridWrapperProps>> = ({ children, gap = 24, itemsInRow = 2, style }) => {
  return (
    <View style={styles.outer}>
      <View style={[style, styles.wrapper, { margin: -gap / 2 }]}>
        <GridProvider padding={gap / 2} width={`${100 / itemsInRow}%`}>
          {children}
        </GridProvider>
      </View>
    </View>
  )
}

export default HoliGridWrapper

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
