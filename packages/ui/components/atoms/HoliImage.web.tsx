import type { CSSProperties } from 'react'
import React from 'react'

import type { HoliImageProps, ImageSource } from '@holi/ui/components/utils/image'
import { resizeModeForWeb } from '@holi/ui/components/utils/image'
import { vars } from '@holi/ui/styles/globalVars'

import styles from './HoliImage.module.scss'

interface Props extends HoliImageProps {
  source: ImageSource | ImageSource[]
  style?: CSSProperties
}

const createSrcSet = (source: ImageSource | ImageSource[]): string | undefined => {
  if (!Array.isArray(source)) return
  return source.map((source) => `${source.uri} ${source.width}w`).join(',')
}

const HoliImage = ({ source, label, style, sizes, resizeMode = 'cover' }: Props) => {
  const srcSet = createSrcSet(source)
  const src = Array.isArray(source) ? source[0].uri : source.uri
  const aspectRatio = style?.aspectRatio ? { aspectRatio: style?.aspectRatio.toString() } : {}

  // We use img tag instead of Image by react-native, as react-native-web does not yet
  // support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      className={styles.image}
      srcSet={srcSet}
      src={src}
      sizes={sizes || (srcSet && `(min-width:${vars.maxScreenWidth}px) ${vars.maxScreenWidth}px, 100vw`)}
      alt={label}
      style={{ ...style, ...aspectRatio, objectFit: resizeModeForWeb(resizeMode) }}
    />
  )
}

export default HoliImage
