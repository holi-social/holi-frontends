import React from 'react'

import { resizeModeForWeb } from '@holi/ui/components/atoms/HoliImage.shared'
import { HoliResponsiveImageProps } from '@holi/ui/components/atoms/HoliResponsiveImage.shared'

const HoliResponsiveImage: React.VoidFunctionComponent<HoliResponsiveImageProps> = ({
  sources,
  label,
  style,
  width,
  height,
  resizeMode = 'cover',
}: HoliResponsiveImageProps) => {
  const srcSet = sources
    .map((source) => {
      return `${source.uri} ${source.width}w`
    })
    .join(',')

  // We use img tag instead of Image by react-native, as react-native-web does not yet support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      srcSet={srcSet}
      width={width}
      height={height}
      alt={label}
      style={{ ...style, objectFit: resizeModeForWeb(resizeMode) }}
    />
  )
}

export default HoliResponsiveImage
