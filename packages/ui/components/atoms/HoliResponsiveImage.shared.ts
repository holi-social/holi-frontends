import { ImageStyle, ImageURISource, StyleProp } from 'react-native'

import { ResizeMode } from '@holi/ui/components/atoms/HoliImage.shared'

export type HoliResponsiveImageProps = {
  sources: ImageURISource[]
  label: string
  style?: StyleProp<ImageStyle>
  resizeMode?: ResizeMode
  width: string
  height: string
}
