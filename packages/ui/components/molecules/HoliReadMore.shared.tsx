import { TextProps, TextStyle, ViewStyle } from 'react-native'

import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'

export type ReadMoreButtonState = 'readMore' | 'readLess' | 'hidden'

export type ReadMoreProps = HoliTextProps &
  TextProps & {
    numberOfLines?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined // 1 line is not supported on Android and in this component
    style?: ViewStyle
    fontStyle?: TextStyle
    buttonStyle?: TextStyle | Record<string, unknown>
  }
