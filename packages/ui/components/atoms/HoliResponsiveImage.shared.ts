import { ImageStyle, StyleProp } from 'react-native'

import { ResizeMode } from '@holi/ui/components/atoms/imageUtils'

type ImageSource = {
  uri: string
  width: number
  height: number
}

export type HoliResponsiveImageProps = {
  sources: ImageSource[]
  label: string
  style?: StyleProp<ImageStyle>
  resizeMode?: ResizeMode
}
