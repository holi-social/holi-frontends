import { Property } from 'csstype'
import { ImageContentFit as ExpoResizeMode } from 'expo-image'
import { ImageProps as ExpoImageProps } from 'expo-image/build/Image.types'
import { CSSProperties } from 'react'
import { ViewProps } from 'react-native'
import { ImageResizeMode as ReactNativeResizeMode } from 'react-native/Libraries/Image/ImageResizeMode'

type WebResizeMode = Property.ObjectFit

// we previously supported all of them, so this should be the common working subset
export type ResizeMode = ReactNativeResizeMode & ExpoResizeMode & WebResizeMode

export interface ImageSource {
  uri: string
  // used to scale down image to a fixed width, use constant value, will be scaled to pixel density!
  width?: number
  // used to scale down image to a fixed height, use constant value, will be scaled to pixel density!
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
}

export interface MobileImageProps extends HoliImageProps {
  // careful, make sure any parameter here works in web as well
  style?: ExpoImageProps['style']
  testID?: ExpoImageProps['testID']
  onLayout?: ViewProps['onLayout']
}

interface WebImageProps extends HoliImageProps {
  // careful, make sure any parameter here works in mobile as well
  style?: CSSProperties
}
