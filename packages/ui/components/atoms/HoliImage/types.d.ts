import type { Property } from 'csstype'
import type { ImageContentFit as ExpoResizeMode } from 'expo-image'
import type { ImageProps as ExpoImageProps } from 'expo-image/build/Image.types'
import type { CSSProperties } from 'react'
import type { ViewProps } from 'react-native'

type WebResizeMode = Property.ObjectFit

export type ResizeMode = ExpoResizeMode & WebResizeMode

export interface ImageSource {
  // a missing uri will be replaced by a placeholder image
  uri?: string
  // to scale down image to fixed width
  // use constant value, will be scaled to pixel density!
  // when there is an aspect ratio mismatch,
  // requested width+height is filled (from image center) and overlap is cropped
  width?: number
  // used to scale down image to this fixed height
  // use constant value, will be scaled to pixel density!
  // when there is an aspect ratio mismatch,
  // requested width+height is filled (from image center) and overlap is cropped
  height?: number
}

export interface HoliImageProps {
  // empty array is a valid input and means no image will be displayed
  source: ImageSource | ImageSource[]
  blurhash?: string
  label: string
  resizeMode?: ResizeMode
  /**
   * Source sizes for web, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   * The default value assumes the image will span the whole screen width until maxScreenWidth.
   */
  sizes?: string
  'aria-hidden'?: boolean
}

export interface MobileImageProps extends HoliImageProps {
  // careful, make sure any parameter here works in web as well
  style?: ExpoImageProps['style']
  testID?: ExpoImageProps['testID']
  onError?: ExpoImageProps['onError']
  onLayout?: ViewProps['onLayout']
  onLoadEnd?: ExpoImageProps['onLoadEnd']
}

interface WebImageProps extends HoliImageProps {
  // careful, make sure any parameter here works in mobile as well
  style?: CSSProperties
  onError?: () => void
  onLoadEnd?: () => void
}
