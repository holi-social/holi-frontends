import { ImageStyle, ImageURISource, StyleProp } from 'react-native'

import { ResizeMode } from '@holi/ui/components/atoms/imageUtils'

export type ImageSource = {
  uri: string
  width: number
  height: number
}

export type HoliImageProps = {
  source: ImageSource[] | ImageURISource
  label: string
  style?: StyleProp<ImageStyle>
  resizeMode?: ResizeMode
  /**
   * Source sizes for web, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   * The default value assumes the image will span the whole screen width until maxScreenWidth.
   */
  sizes?: string
}
