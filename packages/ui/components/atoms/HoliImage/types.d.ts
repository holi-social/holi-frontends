import { ImageContentFit } from 'expo-image'
import { ImageURISource } from 'react-native'

export type ResizeMode = ImageContentFit

export interface ImageSource {
  uri: string
  width: number
  height: number
}

export interface HoliImageProps {
  source: ImageSource[] | ImageURISource
  blurhash?: string
  label: string
  resizeMode?: ResizeMode
  /**
   * Source sizes for web, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   * The default value assumes the image will span the whole screen width until maxScreenWidth.
   */
  sizes?: string
}
