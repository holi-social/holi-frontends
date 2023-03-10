import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import type { FlexAlignType } from 'react-native'

type BoxSpace = number | [number, number] | [number, number, number, number]

const isBoxSpace = (value: number | number[]): value is BoxSpace => {
  if (typeof value === 'number') return true
  if (!Array.isArray(value)) return false
  if (value.length === 2) return true
  if (value.length === 4) return true

  return false
}

interface NamedPaddingStyle {
  readonly boxPadding: {
    readonly padding: BoxSpace
  }
}

function createBoxPadding(padding: number | number[]): StyleSheet.NamedStyles<NamedPaddingStyle> {
  const fallback = StyleSheet.create({ boxPadding: { padding: 0 } })
  if (!isBoxSpace(padding)) return fallback

  if (Array.isArray(padding)) {
    if (padding.length === 2) {
      return StyleSheet.create({ boxPadding: { paddingVertical: padding[0], paddingHorizontal: padding[1] } })
    }

    if (padding.length === 4) {
      return StyleSheet.create({
        boxPadding: {
          paddingTop: padding[0],
          paddingRight: padding[1],
          paddingBottom: padding[2],
          paddingLeft: padding[3],
        },
      })
    }

    return fallback
  }

  return StyleSheet.create({ boxPadding: { padding: padding } })
}

export interface BoxLayoutProps {
  display?: 'none' | 'flex' | undefined
  alignItems?: FlexAlignType
  alignSelf?: 'auto' | FlexAlignType | undefined
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | undefined
  maxWidth?: number | string | undefined
  width?: number | string | undefined
}

function generateStyles(padding: number | number[], layout?: BoxLayoutProps) {
  const boxStyles = createBoxPadding(padding)
  const layoutStyles = StyleSheet.create({ boxLayout: { ...layout } })
  return StyleSheet.flatten([boxStyles.boxPadding, layoutStyles.boxLayout])
}

interface Props {
  padding: number | number[]
  layout?: BoxLayoutProps
  testID?: string
}

/** The padding prop works the same as the CSS box model. Only one value equals
the shorthand and sets the same value to all four sides `padding: 4`. The tuple
`[4, 10]` represents the vertical and horizontal `paddingVertical: 4,
paddingHorizontal: 10`. The box represents all four sides `top, right, bottom,
left`.

Ideally, we use the future pre-defined space atoms instead of passing any
possible padding value. */
const HoliBox = ({ children, layout, padding, testID }: PropsWithChildren<Props>) => (
  <View style={generateStyles(padding, layout)} testID={testID}>
    {children}
  </View>
)

export default HoliBox
