import React from 'react'
import type { AccessibilityProps } from 'react-native'

import { setScalingParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import type { ImageSource, WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'
import { dimensions } from '@holi/ui/styles/globalVars'

import styles from './styles.module.css'

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

const HoliImage = ({
  source,
  label,
  style,
  sizes,
  resizeMode = 'cover',
  onError,
  onLoadEnd,
  'aria-hidden': ariaHidden,
}: WebImageProps) => {
  const srcSet = createSrcSet(source)
  const aspectRatio = style?.aspectRatio ? { aspectRatio: style?.aspectRatio.toString() } : {}

  const accessibilityProps: AccessibilityProps = {
    role: 'img',
    'aria-label': label,
    'aria-hidden': ariaHidden,
  }

  // We use img tag instead of Image by react-native, as react-native-web does not yet
  // support multiple sources for image tag: https://github.com/necolas/react-native-web/issues/515
  return (
    <img
      className={styles.image}
      srcSet={srcSet}
      src={createSrc(source)}
      sizes={sizes || (srcSet && `(min-width:${dimensions.maxScreenWidth}px) ${dimensions.maxScreenWidth}px, 100vw`)}
      alt={label}
      onError={onError}
      onLoad={onLoadEnd}
      {...accessibilityProps}
      style={{ ...style, ...aspectRatio, objectFit: resizeMode }}
    />
  )
}

export default HoliImage
