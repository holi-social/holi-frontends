import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

export interface ImageCaptionProps {
  position?: 'top' | 'bottom'
  testID?: string
}

export const ImageCaption = ({ position = 'bottom', children, testID }: PropsWithChildren<ImageCaptionProps>) => (
  <View style={[styles.imageCaption, { [position]: 8 }]} testID={`${testID}-caption`}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  imageCaption: {
    position: 'absolute',
    maxWidth: '100%',
    paddingHorizontal: 8,
  },
})
