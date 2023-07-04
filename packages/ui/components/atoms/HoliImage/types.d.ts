import { Property } from 'csstype'
import { ImageContentFit as ExpoResizeMode } from 'expo-image'
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
