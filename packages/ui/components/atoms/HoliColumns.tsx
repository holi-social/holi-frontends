import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import type { FlexAlignType, FlexStyle } from 'react-native'

import { createBoxPadding } from '@holi/ui/components/utils/boxSpacing'

interface Props {
  /** Aligns child nodes along the x-axis. Defaults to flex-start  */
  justifyContent?: FlexStyle['justifyContent']
  /** Aligns child nodes along the cross y-axis  */
  alignItems?: FlexAlignType
  /** Alignment of lines along the cross-axis when wrapping */
  alignContent?: FlexStyle['alignContent']
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  padding?: number | number[]
  testID?: string
}

const generateStyles = (
  styles: DefaultStyles,
  padding: number | number[] | undefined,
  layout: Omit<Props, 'padding' | 'testID'>
) => {
  const boxStyles = padding ? createBoxPadding(padding) : null
  const layoutStyles = StyleSheet.create({ columnLayout: { ...layout } })
  return StyleSheet.flatten([styles.default, boxStyles?.boxPadding, layoutStyles.columnLayout])
}

/**
 * @name HoliColumns
 * @description The `HoliColumns` is a layout primitive component based on
 * Meta's Yoga Layout, the Layout Engine used in React Native under the hood. It
 * displays its children next to each other like a `flex: row` layout, and its
 * only responsibility is to position children next to each other. If you need
 * to change the alignment of children, you can use the `HoliColumn` component.
 * It also accepts a padding propery just like the `HoliBox`.
 */
const HoliColumns = ({ children, padding, testID, ...layoutProps }: PropsWithChildren<Props>) => (
  <View style={generateStyles(styles, padding, layoutProps)} testID={testID}>
    {children}
  </View>
)

export default HoliColumns

interface DefaultStyles {
  default: {
    flex: number
    flexDirection: 'row'
    justifyContent: 'flex-start'
    alignItems: 'stretch'
    alignContent: 'space-between'
  }
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'space-between',
  },
})
