import React from 'react'
import { ImageStyle, StyleSheet } from 'react-native'

import { HoliImageProps } from '@holi/ui/components/atoms/HoliImage.shared'
import { resizeModeForWeb } from '@holi/ui/components/atoms/imageUtils'
import { vars } from '@holi/ui/styles/globalVars'

const HoliImage: React.VoidFunctionComponent<HoliImageProps> = ({
  source,
  label,
  style,
  resizeMode = 'cover',
}: HoliImageProps) => {
  const defaultStyle = {
    objectFit: resizeModeForWeb(resizeMode),
    borderStyle: 'solid',
    borderWidth: 0,
    maxWidth: '100%',
  }
  const srcSet = Array.isArray(source)
    ? source
        .map((source) => {
          return `${source.uri} ${source.width}w`
        })
        .join(',')
    : undefined
  const src = !srcSet ? source.uri : undefined
  const sizes = srcSet ? `(min-width:${vars.maxScreenWidth}px) ${vars.maxScreenWidth}px, 100vw` : undefined

  // We use img tag instead of Image by react-native, as react-native-web does not yet
  // support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      srcSet={srcSet}
      src={src}
      sizes={sizes}
      alt={label}
      style={StyleSheet.flatten<ImageStyle>([defaultStyle, style])}
    />
  )
}

export default HoliImage
