import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { BorderRadius } from './utils'

export interface ImageContainerProps {
  borderRadius?: BorderRadius
  extraBottomMargin?: boolean
  testID?: string
  flexBasis?: ViewStyle['flexBasis']
}

export const ImageContainer = ({
  borderRadius = 8,
  extraBottomMargin = true,
  children,
  testID,
  flexBasis,
}: PropsWithChildren<ImageContainerProps>) => {
  const marginBottom = extraBottomMargin ? 16 : 0
  return (
    <View
      style={[styles.imageContainer, { borderRadius, marginBottom, flexBasis }]}
      testID={`${testID}-image-container`}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flexGrow: 0,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
})
