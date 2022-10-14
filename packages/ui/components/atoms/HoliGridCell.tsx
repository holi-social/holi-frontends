/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { View, ViewStyle } from 'react-native'

import { useGrid } from '@holi/ui/components/atoms/HoliGridWrapper'

export interface HoliGridCellProps {
  style: ViewStyle
}

const HoliGridCell: React.FC<Partial<HoliGridCellProps>> = ({ children, style }) => {
  const { padding, width } = useGrid()
  return <View style={[style, { padding, width }]}>{children}</View>
}

export default HoliGridCell
