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
}
