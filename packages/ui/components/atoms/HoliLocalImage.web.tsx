import Image from 'next/image'
import { HoliLocalImageProps } from 'packages/ui/components/atoms/HoliLocalImage.shared'
import React from 'react'
import { ImageStyle, StyleSheet } from 'react-native'

// Usage:

// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} altText="some alt text" />
// or
// <HoliLocalImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} altText="some alt text" />

// CAUTION: This code is the same for web and mobile, but can't be shared, because otherwise storybook breaks
export const setDefaultResizeMode = (style: ImageStyle): ImageStyle => {
  const resultingStyle: ImageStyle = { resizeMode: 'cover', ...style }
  // use the same resizeMode for web and mobile as default for same behaviour
  //if (!resultingStyle.resizeMode) {
  resultingStyle.resizeMode = 'stretch'
  //}
  return resultingStyle
}

const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  label,
  width,
  height,
  style,
}: HoliLocalImageProps) => {
  const pathFromRequire = imageSource.src
  const pathFromImport = imageSource.default?.src
  const path = pathFromRequire || pathFromImport || `/${imageSource}`
  const styleWithResizeMode = setDefaultResizeMode(StyleSheet.flatten(style || {})) // web implementation of flatten breaks when undefined is passed in, default {}

  //  if (width && height) {
  return (
    <Image
      src={path as string}
      alt={label}
      width={width}
      height={height}
      objectFit="cover"
      style={[styleWithResizeMode]}
    />
  )
  //  } else {
  //    return <Image src={path as string} alt={label} layout="fill" style={styleWithResizeMode} />
  //  }
}

export default HoliLocalImage
