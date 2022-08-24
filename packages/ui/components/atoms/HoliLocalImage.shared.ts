import { ImageStyle, StyleProp } from 'react-native'

// TODO: intermediate fix until
// https://github.com/vercel/next.js/issues/29788
type StaticImageData = {
  src?: string
  height?: number
  width?: number
  blurDataURL?: string
  default?: { src: string }
}

/**
 * These modes work the same across web and mobile and therefore are the only ones we allow.
 */
export const ResizeModes: ('cover' | 'contain' | 'stretch')[] = [
  'cover',
  'contain',
  'stretch', // fill in web
  // center and repeat have no web equivalent
]
export type ResizeMode = typeof ResizeModes[number]

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
   * The width of the image. Required since without dimensions, there is no way to achieve the same behaviour on web and mobile.
   */
  width: number
  /**
   * The height of the image. Required since without dimensions, there is no way to achieve the same behaviour on web and mobile.
   */
  height: number
  /**
   * The style to apply to the image.
   */
  style?: StyleProp<ImageStyle>
  /**
   * The resizeMode to apply to the image. Default 'cover'. Using the React Native values and mapping them to corresponding object-fit values for web.
   */
  resizeMode?: ResizeMode
}
