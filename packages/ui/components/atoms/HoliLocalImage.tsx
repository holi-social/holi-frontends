import { AccessibilityPropsWeb } from 'packages/ui/@types/reactNativeWeb'
import React from 'react'
import { AccessibilityProps, Image, ImageStyle, StyleProp, StyleSheet } from 'react-native'
// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
// https://github.com/react-native-svg/react-native-svg/pull/1443
// @ts-ignore
import { WithLocalSvg } from 'react-native-svg'

// Usage:
// <HoliLocalImage imageFile={PngLogo} style={{ width: 30, height: 30 }} altText="some alt text" />
// <HoliLocalImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} style={{ width: 50, height: 50 }} altText="some alt text" />

// TODO: intermediate fix until
// https://github.com/vercel/next.js/issues/29788
type StaticImageData = {
  src?: string
  height?: number
  width?: number
  blurDataURL?: string
  default?: { src: string }
}

export type HoliLocalImageProps = {
  imageSource: StaticImageData
  // we need the hint if the image source is an svg because for images defined via require()-calls,
  // we can't know, at least on mobile, where the resulting type of the require is number
  isSvg?: boolean
  /**
   * The explanatory label / alt text.
   * IMPORTANT: if your image is only decorative, you must set a label of '' (empty string), so that screenreaders know to ignore this image.
   */
  label: string
  /**
   * The style to apply to the image.
   * IMPORTANT: you must EITHER set a width AND height in the style OR (untested) you must wrap the component in a sized container so it fills the container.
   */
  style?: StyleProp<ImageStyle>
}

export const processStyle = (
  style?: StyleProp<ImageStyle>
): { width: string | number | undefined; height: string | number | undefined; processed: ImageStyle } => {
  const flattenedStyle = StyleSheet.flatten(style || {}) // style=undefined leads to error, safeguard with default empty object
  // extract width and height for the corresponding attributes
  const { width, height } = flattenedStyle
  // use the same resizeMode for web and mobile as default for same behaviour
  if (!flattenedStyle.resizeMode) {
    flattenedStyle.resizeMode = 'stretch'
  }
  return {
    width,
    height,
    processed: flattenedStyle,
  }
}

// TODO: use this implementation to distinguish between require() and {uri: 'http:someImageurl'}
// https://gist.github.com/cryser29/9320f782562af06fb06082b1fce29094
const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  isSvg = false,
  label,
  style,
}: HoliLocalImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  const { width, height, processed } = processStyle(style)

  return isSvg ? (
    <WithLocalSvg {...accessibilityProps} asset={imageSource} width={width} height={height} style={processed} />
  ) : (
    <Image {...accessibilityProps} source={imageSource} style={[{ overflow: 'visible' }, processed]} />
  )
}

export default HoliLocalImage
