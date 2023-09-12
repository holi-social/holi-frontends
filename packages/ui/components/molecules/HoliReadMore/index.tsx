import React, { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import type { TextLayoutEventData, TextLayoutLine } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { styles } from '@holi/ui/components/molecules/HoliReadMore/shared'
import type { ReadMoreButtonState, ReadMoreProps } from '@holi/ui/components/molecules/HoliReadMore/shared'

/**
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore = ({ children, testID, numberOfLines = 3, ...textProps }: PropsWithChildren<ReadMoreProps>) => {
  const [truncatedText, setTruncatedText] = useState(() => children || '')
  const [buttonState, setButtonState] = useState<ReadMoreButtonState>('hidden')

  const { t } = useTranslation()

  const readLessButtonText = t('component.readMore.readLess')

  // needed for its length calculation
  const readMoreButtonText = t('component.readMore.readMore')

  // render a custom ellipsis for the truncated text
  const ellipsis = '... '

  const handleTextLayoutEvent = ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
    if (!lines.length) return

    if (lines.length <= numberOfLines) {
      return
    }

    const [truncatedText, isTruncated] = truncateTextByLines(lines, numberOfLines, ellipsis)

    // if truncating the text is required and button was hidden before, set the button state to 'readMore'
    if (isTruncated && buttonState === 'hidden') {
      setButtonState('readMore')
    }

    setTruncatedText(truncatedText)
  }

  const handleButtonPress = () => {
    setButtonState((previousState) => (previousState === 'readMore' ? 'readLess' : 'readMore'))
  }

  return (
    <>
      <Text
        onTextLayout={handleTextLayoutEvent}
        numberOfLines={buttonState !== 'readLess' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={styles.textContainer}
        testID={testID}
      >
        {/* The visible text. Any font style props and remaining textProps are applied here */}
        <HoliText testID="holi-readmore-text" color="gray300" {...textProps}>
          {buttonState === 'readMore' ? truncatedText : children} {buttonState === 'readLess' && ' '}
        </HoliText>
      </Text>
      {/* using a Text as the button, due to vertical aligning issues on Android https://github.com/facebook/react-native/issues/27549 */}
      {buttonState !== 'hidden' && (
        <View>
          <HoliText color="black300" accessible={true} accessibilityRole="button" onPress={handleButtonPress} bold>
            {buttonState === 'readMore' ? readMoreButtonText : readLessButtonText}
          </HoliText>
        </View>
      )}
    </>
  )
}
function truncateTextByLines(textLines: TextLayoutLine[], numberOfLines: number, ellipsis: string): [string, boolean] {
  const isTruncated = textLines.length > numberOfLines
  const text = textLines
    .map((line, index) => {
      const { text } = line
      // if we are in the last visible line, truncate it in case its text is too long
      //(longer or equal to the length of first line minus the button text length)
      if (numberOfLines - 1 === index) {
        return text + ellipsis
      }

      // disconsider any lines beyond numberOfLines for the truncated text
      if (index > numberOfLines - 1) return ''

      return text
    })
    .join('')

  return [text, isTruncated]
}

export default HoliReadMore
