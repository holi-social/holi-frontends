// Will be resolved with HOLI-10365
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, TextLayoutLine, TextProps, TextStyle, ViewStyle } from 'react-native'

import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'

export type ReadMoreButtonState = 'readMore' | 'readLess' | 'hidden'
export type ReadMoreNumberOfLines = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface ReadMoreProps extends HoliTextProps, TextProps {
  numberOfLines?: ReadMoreNumberOfLines // 1 line is not supported on Android and in this component
  style?: ViewStyle
  buttonStyle?: TextStyle | Record<string, unknown>
  onReadMoreSideEffect?: CallableFunction
  onReadLessSideEffect?: CallableFunction
}

export const styles = StyleSheet.create({
  textContainer: {
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  readMoreWeb: {
    marginTop: 1.5,
  },
})

export function truncateTextByLines(textLines: TextLayoutLine[], numberOfLines: number, ellipsis: string): string {
  const shortTextLines = textLines.slice(0, numberOfLines)
  const needsEllipsis = shortTextLines.length == numberOfLines
  const shortText = shortTextLines.map((line) => line.text).join('')
  return needsEllipsis ? shortText.replace(/\S*\W+$/, ellipsis) : shortText
}
