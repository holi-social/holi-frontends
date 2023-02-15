import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TextLayoutEventData, TextLayoutLine, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { ReadMoreButtonState, ReadMoreProps, styles } from '@holi/ui/components/molecules/HoliReadMore/shared'

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore: React.FunctionComponent<ReadMoreProps> = ({
  children,
  numberOfLines = 3,
  style = {},
  fontStyle = {},
  buttonStyle = {},
  ...textProps
}) => {
  const [truncatedText, setTruncatedText] = useState(children || '')
  const [buttonState, setButtonState] = useState<ReadMoreButtonState>('hidden')
  // remember line lengths to keep track of layout changes
  const [allowedLineLength, setAllowedLineLength] = useState(0)
  const { t } = useTranslation()

  const readLessButtonText = t('component.readMore.readLess')

  // needed for its length calculation
  const readMoreButtonText = t('component.readMore.readMore')
  const { length: readMoreButtonTextLength } = readMoreButtonText

  // buffer factor to truncate the text for extra space (readMoreButtonTextLength * bufferTextFactor)
  const bufferTextFactor = 2

  // render a custom ellipsis for the truncated text
  const ellipsis = '... '
  const { length: ellipsisLength } = ellipsis

  // for mobile only: onTextLayout is not supported on web - https://github.com/necolas/react-native-web/issues/1685
  const handleTextLayoutEvent = useCallback(
    ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
      if (!lines.length) {
        return
      }

      // get the length of the first line as a base to truncate the text
      const firstLineLength = lines[0].text.length
      const maxAllowedLineLength = firstLineLength - readMoreButtonTextLength * bufferTextFactor - ellipsisLength

      // Check if there have been layout changes (impacting the width of the rendered text)
      if (maxAllowedLineLength === allowedLineLength) {
        // Keep text and button state as they are
        return
      }

      setAllowedLineLength(maxAllowedLineLength)
      const lastLineLength = lines[lines.length - 1].text.length

      // ignore truncating when there is no hidden text (no need for a Read more button)
      if (lines.length <= numberOfLines && lastLineLength <= maxAllowedLineLength) {
        if (buttonState !== 'hidden') {
          // if the text was truncated before, reset allowed line length
          // > let next text layout event (triggered by change of button state) decide on button state
          setAllowedLineLength(0)
          setButtonState('hidden')
        }
        return
      }

      // check whether truncating is necessary
      let truncated = false

      const truncatedText = lines
        .map((line: TextLayoutLine, index: number) => {
          const { text } = line

          // if we are in the last visible line, truncate it in case its text is too long (longer or equal to the length of first line minus the button text length)
          if (numberOfLines - 1 === index && text.length >= maxAllowedLineLength) {
            // only display Read More button if truncating was needed
            truncated = true

            return text.substring(0, maxAllowedLineLength) + ellipsis
          }

          // disconsider any lines beyond numberOfLines for the truncated text
          if (index > numberOfLines - 1) {
            return ''
          }

          return text
        })
        .join('')

      // if truncating the text is required and button was hidden before, set the button state to 'readMore'
      if (truncated) {
        if (buttonState === 'hidden') {
          setButtonState('readMore')
        }
      } else {
        setButtonState('hidden')
      }

      setTruncatedText(truncatedText)
    },
    [buttonState, allowedLineLength, ellipsisLength, numberOfLines, readMoreButtonTextLength]
  )

  const toggleButtonState = useCallback(() => {
    setButtonState((previousState) => (previousState === 'readMore' ? 'readLess' : 'readMore'))
  }, [])

  return (
    <View style={style}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onTextLayout={handleTextLayoutEvent}
        numberOfLines={buttonState !== 'readLess' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={styles.textContainer}
      >
        {/* The visible text. Any font style props and remaining textProps are applied here */}
        <HoliText size="small" style={[styles.text, fontStyle]} {...textProps}>
          {buttonState === 'readMore' ? truncatedText : children} {buttonState === 'readLess' && ' '}
        </HoliText>

        {/* using a Text as the button, due to vertical aligning issues on Android https://github.com/facebook/react-native/issues/27549 */}
        {buttonState !== 'hidden' && (
          <HoliText
            onPress={toggleButtonState}
            accessible={true}
            accessibilityRole="button"
            size="small"
            style={[styles.text, buttonStyle]}
          >
            {buttonState === 'readMore' ? readMoreButtonText : readLessButtonText}
          </HoliText>
        )}
      </Text>
    </View>
  )
}

export default HoliReadMore
