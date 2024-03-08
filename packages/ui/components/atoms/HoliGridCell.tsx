/* eslint-disable @typescript-eslint/no-var-requires */
import React, { type PropsWithChildren } from 'react'
import { View } from 'react-native'

import { useGrid } from '@holi/ui/components/atoms/HoliGridWrapper'

export interface HoliGridCellProps {
  testID?: string
}

const HoliGridCell = ({ testID, children }: PropsWithChildren<HoliGridCellProps>) => {
  const { styles, id } = useGrid()

  return (
    <View testID={testID} style={styles} dataSet={{ media: id }}>
      {children}
    </View>
  )
}

export default HoliGridCell
