import * as React from 'react'
import { StyleSheet } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { MobileImageProps } from '@holi/ui/components/atoms/HoliImage/types'

type CardAspectRatio = 1 | 1.5 | 1.75

export interface ImageProps {
  imageUri?: string
  imageLabel: string
  imageWidth: number
  imageBlurhash?: string
  imageHeight?: number
  borderRadius?: number
  imageAspectRatio?: CardAspectRatio
  onError?: MobileImageProps['onError']
  testID?: string
}

export const Image = ({
  imageUri,
  imageLabel,
  imageBlurhash,
  imageWidth,
  imageHeight,
  imageAspectRatio = 1.5,
  borderRadius = 8,
  testID,
}: ImageProps) => {
  return (
    <HoliImage
      testID={`${testID}-card-image`}
      source={{ uri: imageUri, width: imageWidth, height: imageHeight }}
      blurhash={imageBlurhash}
      label={imageLabel}
      style={StyleSheet.flatten([styles.image, { aspectRatio: imageAspectRatio, borderRadius }])}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
})
