import type { PropsWithChildren } from 'react'
import React from 'react'
import { type FlexStyle, StyleSheet, View } from 'react-native'
import type { FlexAlignType, ViewStyle } from 'react-native'

import { createBoxPadding } from '@holi/ui/components/utils/boxSpacing'

export interface BoxLayoutProps {
  display?: ViewStyle['display']
  flexDirection?: FlexStyle['flexDirection']
  alignItems?: FlexAlignType
  alignSelf?: 'auto' | FlexAlignType
  justifyContent?: FlexStyle['justifyContent']
  maxWidth?: FlexStyle['maxWidth']
  width?: FlexStyle['width']
}

const generateStyles = (padding: number | number[], layout?: BoxLayoutProps) => {
  const boxStyles = createBoxPadding(padding)
  const layoutStyles = StyleSheet.create({ boxLayout: { ...layout } })
  return StyleSheet.flatten([boxStyles && boxStyles.boxPadding, layoutStyles.boxLayout])
}

interface Props {
  padding: number | number[]
  layout?: BoxLayoutProps
  testID?: string
}

/**
 * @name HoliBox
 * @description The padding prop works the same as the CSS box model. Only one
 * value equals the shorthand and sets the same value to all four sides
 * `padding: 4`. The tuple `[4, 10]` represents the vertical and horizontal
 * `paddingVertical: 4, paddingHorizontal: 10`. The box represents all four
 * sides `top, right, bottom, left`.
 *
 * TODO: Ideally, we use the future pre-defined space atoms instead of passing any
 * possible padding value. */
const HoliBox = ({ children, layout, padding, testID }: PropsWithChildren<Props>) => (
  <View style={generateStyles(padding, layout) as ViewStyle} testID={testID}>
    {children}
  </View>
)

export default HoliBox
