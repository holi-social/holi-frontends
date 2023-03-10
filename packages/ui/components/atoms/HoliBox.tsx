import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

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

interface Props {
  padding: number | number[]
  testID?: string
}

/** The padding prop works the same as the CSS box model. Only one value equals
the shorthand and sets the same value to all four sides `padding: 4`. The tuple
`[4, 10]` represents the vertical and horizontal `paddingVertical: 4,
paddingHorizontal: 10`. The box represents all four sides `top, right, bottom,
left`.

Ideally, we use the future pre-defined space atoms instead of passing any
possible padding value. */
const HoliBox = ({ children, padding, testID }: PropsWithChildren<Props>) => {
  const styles = createBoxPadding(padding)

  return (
    <View style={styles.boxPadding} testID={testID}>
      {children}
    </View>
  )
}

export default HoliBox
