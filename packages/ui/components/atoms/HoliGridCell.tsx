/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { View, ViewStyle } from 'react-native'

import { useGrid } from '@holi/ui/components/atoms/HoliGridWrapper'

export interface HoliGridCellProps {
  style: ViewStyle
  testID?: string
}

const HoliGridCell = ({ testID, children, style }: React.PropsWithChildren<Partial<HoliGridCellProps>>) => {
  const { padding, width } = useGrid()
  return (
    <View testID={testID} style={[style, { padding, width }]}>
      {children}
    </View>
  )
}

export default HoliGridCell
