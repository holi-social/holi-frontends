import * as React from 'react'
import { StyleSheet } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import type { MobileImageProps } from '@holi/ui/components/atoms/HoliImage/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'

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
  imageFallback?: StaticImageData
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
  imageFallback,
}: ImageProps) => {
  if (!imageUri && imageFallback) {
    return (
      <HoliLocalImage
        imageSource={imageFallback}
        label={imageLabel}
        width={imageWidth}
        height={imageHeight ?? imageWidth / imageAspectRatio}
        style={StyleSheet.flatten([styles.image, { aspectRatio: imageAspectRatio, borderRadius }])}
      />
    )
  }
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
