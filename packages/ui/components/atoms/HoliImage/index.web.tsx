import React from 'react'

import { setScalingParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import { ImageSource, WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'
import { vars } from '@holi/ui/styles/globalVars'

import styles from './styles.module.scss'

const createSrcSet = (source: ImageSource | ImageSource[]): string | undefined => {
  if (!Array.isArray(source)) {
    return undefined
  }
  return source
    .filter((source) => !!source.width)
    .map((source) => {
      const { uri, width } = setScalingParams(source)
      return `${uri} ${width}w`
    })
    .join(',')
}

const createSrc = (source: ImageSource | ImageSource[]): string | undefined => {
  if (Array.isArray(source)) {
    if (source.length) {
      return setScalingParams(source[0]).uri
    } else {
      return undefined
    }
  } else {
    return setScalingParams(source).uri
  }
}

const HoliImage = ({ source, label, style, sizes, resizeMode = 'cover' }: WebImageProps) => {
  const srcSet = createSrcSet(source)
  const aspectRatio = style?.aspectRatio ? { aspectRatio: style?.aspectRatio.toString() } : {}

  // We use img tag instead of Image by react-native, as react-native-web does not yet
  // support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      className={styles.image}
      srcSet={srcSet}
      src={createSrc(source)}
      sizes={sizes || (srcSet && `(min-width:${vars.maxScreenWidth}px) ${vars.maxScreenWidth}px, 100vw`)}
      alt={label}
      style={{ ...style, ...aspectRatio, objectFit: resizeMode }}
    />
  )
}

export default HoliImage
