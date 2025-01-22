import type { ImageBackgroundProps, ViewStyle } from 'react-native'
import type { WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'
import type { CSSProperties } from 'react'

export type HoliImageBackgroundProps = Omit<ImageBackgroundProps, 'source' | 'onError' | 'style'> &
  Pick<WebImageProps, 'source' | 'onError'> & {
    style?: ViewStyle | ImageStyle | CSSProperties
    label?: string
  }
