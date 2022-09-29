import React from 'react'
import { ImageStyle, StyleSheet } from 'react-native'

import { HoliResponsiveImageProps } from '@holi/ui/components/atoms/HoliResponsiveImage.shared'
import { resizeModeForWeb } from '@holi/ui/components/atoms/imageUtils'

const HoliResponsiveImage: React.VoidFunctionComponent<HoliResponsiveImageProps> = ({
  sources,
  label,
  style,
  resizeMode = 'cover',
}: HoliResponsiveImageProps) => {
  const srcSet = sources
    .map((source) => {
      return `${source.uri} ${source.width}w`
    })
    .join(',')

  // We use img tag instead of Image by react-native, as react-native-web does not yet
  // support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      srcSet={srcSet}
      alt={label}
      style={StyleSheet.flatten<ImageStyle>([style, { objectFit: resizeModeForWeb(resizeMode) }])}
    />
  )
}

export default HoliResponsiveImage
