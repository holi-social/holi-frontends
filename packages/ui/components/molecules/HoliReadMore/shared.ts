import { TextProps, TextStyle, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type ReadMoreButtonState = 'readMore' | 'readLess' | 'hidden'

export type ReadMoreProps = HoliTextProps &
  TextProps & {
    numberOfLines?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined // 1 line is not supported on Android and in this component
    style?: ViewStyle
    fontStyle?: TextStyle
    buttonStyle?: TextStyle | Record<string, unknown>
  }

export const styles = StyleSheet.create({
  textContainer: {
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    color: colors.foreground20,
  },
  readMoreWeb: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingLeft: 34,
    paddingRight: 20,
    backgroundImage: `linear-gradient(to right, transparent , ${colors.background10} 15%)`,
  },
  readLessWeb: {
    width: 'fit-content',
    marginTop: 1.5,
  },
})
