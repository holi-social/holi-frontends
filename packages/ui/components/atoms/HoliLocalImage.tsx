import { ImageSource } from 'expo-image'
import React from 'react'
import { AccessibilityProps, Image, ImageRequireSource, ImageSourcePropType, ImageURISource } from 'react-native'
import { WithLocalSvg } from 'react-native-svg/css'

import { HoliLocalImageProps } from '@holi/ui/components/atoms/HoliLocalImage.shared'

// Usage:
// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageSource={PngLogo} width={30} height={30} label="some alt text" />
// <HoliLocalImage imageSource={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} width={30} height={30} label="some alt text" />

/**
 * @deprecated Use `Image` from holiBricks instead.
 */
const HoliLocalImage = ({
  imageSource,
  isSvg = false,
  label,
  width,
  height,
  style,
  resizeMode = 'cover',
}: HoliLocalImageProps) => {
  const accessibilityProps: AccessibilityProps = {
    accessible: false,
    role: 'img',
    'aria-label': label,
  }

  let consolidatedImageSource: ImageSource | ImageRequireSource | undefined = undefined
  if (isImageURISource(imageSource)) {
    consolidatedImageSource = imageSource as ImageSource
  } else {
    if (isImageRequireSource(imageSource)) {
      consolidatedImageSource = imageSource as ImageRequireSource
    }
  }

  if (!consolidatedImageSource) return <></> // Avoid crashes in case of icon missing in our Iconset

  return isSvg ? (
    // @ts-ignore
    <WithLocalSvg
      {...accessibilityProps}
      asset={imageSource}
      width={width}
      height={height}
      style={[{ resizeMode }, style]}
    />
  ) : (
    <Image
      {...accessibilityProps}
      source={consolidatedImageSource}
      style={[{ overflow: 'visible', resizeMode: resizeMode }, style, { width, height }]}
    />
  )
}

function isImageURISource(source: ImageSourcePropType): source is ImageURISource {
  return (source as ImageURISource).uri !== undefined
}

function isImageRequireSource(source: ImageSourcePropType): source is ImageRequireSource {
  return typeof source === 'number'
}

export default HoliLocalImage
