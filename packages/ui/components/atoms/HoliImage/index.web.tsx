import type { CSSProperties } from 'react'
import React from 'react'

import { setImageKitParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import { HoliImageProps, ImageSource } from '@holi/ui/components/atoms/HoliImage/types'
import { vars } from '@holi/ui/styles/globalVars'

import styles from './styles.module.scss'

interface Props extends HoliImageProps {
  // careful, make sure any parameter here works in mobile as well
  style?: CSSProperties
}

const createSrcSet = (source: ImageSource | ImageSource[]): string | undefined => {
  if (!Array.isArray(source)) return
  return source
    .map((source) => {
      const { uri, width } = setImageKitParams(source)
      return `${uri} ${width}w`
    })
    .join(',')
}

const HoliImage = ({ source, label, style, sizes, resizeMode = 'cover' }: Props) => {
  const srcSet = createSrcSet(source)
  const src = Array.isArray(source) ? setImageKitParams(source[0]) : setImageKitParams(source)
  const aspectRatio = style?.aspectRatio ? { aspectRatio: style?.aspectRatio.toString() } : {}

  // We use img tag instead of Image by react-native, as react-native-web does not yet
  // support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      className={styles.image}
      srcSet={srcSet}
      src={src.uri}
      sizes={sizes || (srcSet && `(min-width:${vars.maxScreenWidth}px) ${vars.maxScreenWidth}px, 100vw`)}
      alt={label}
      style={{ ...style, ...aspectRatio, objectFit: resizeMode }}
    />
  )
}

export default HoliImage
