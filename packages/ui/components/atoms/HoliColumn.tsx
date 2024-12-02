import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import type { FlexStyle, ViewStyle } from 'react-native'

import { createBoxPadding } from '@holi/ui/components/utils/boxSpacing'

interface Props {
  /** Override align items of parent */
  alignSelf?: FlexStyle['alignSelf']
  alignItems?: FlexStyle['alignItems']
  /** The factor of remaining space should be given to this node */
  flex?: FlexStyle['flex']
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  padding?: number | number[]
  testID?: string
}

const generateStyles = (padding: number | number[] | undefined, layout: Omit<Props, 'padding' | 'testID'>) => {
  const boxStyles = padding ? createBoxPadding(padding) : null
  const layoutStyles = StyleSheet.create({ columnLayout: { ...layout } })
  return StyleSheet.flatten<FlexStyle>([boxStyles?.boxPadding, layoutStyles.columnLayout])
}

/**
 * @name HoliColumn
 * @description The `HoliColumn` is a layout primitive and a direct child of the
 * `HoliColumns`. It overrides any layout defined by the parent by using
 * `align-self`. It also accepts a padding like the `HoliBox`.
 */
const HoliColumn = ({ children, padding, testID, ...laoutProps }: PropsWithChildren<Props>) => (
  <View style={generateStyles(padding, laoutProps) as ViewStyle} testID={testID}>
    {children}
  </View>
)

export default HoliColumn
