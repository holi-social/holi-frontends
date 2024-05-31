import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { BorderRadius } from './utils'

export interface ImageContainerProps {
  borderRadius?: BorderRadius
  testID?: string
}

export const ImageContainer = ({ borderRadius = 8, children, testID }: PropsWithChildren<ImageContainerProps>) => (
  <View style={[styles.imageContainer, { borderRadius }]} testID={`${testID}-image-container`}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  imageContainer: {
    flexGrow: 0,
    flexShrink: 0,
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
  },
})
