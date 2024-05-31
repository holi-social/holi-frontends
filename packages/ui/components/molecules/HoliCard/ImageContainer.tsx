import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { BorderRadius } from './utils'

export interface ImageContainerProps {
  borderRadius?: BorderRadius
  extraBottomMargin?: boolean
  testID?: string
}

export const ImageContainer = ({
  borderRadius = 8,
  extraBottomMargin = true,
  children,
  testID,
}: PropsWithChildren<ImageContainerProps>) => {
  const marginBottom = extraBottomMargin ? 16 : 0
  return (
    <View style={[styles.imageContainer, { borderRadius, marginBottom }]} testID={`${testID}-image-container`}>
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
