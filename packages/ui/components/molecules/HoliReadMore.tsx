import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TextLayoutEventData, TextLayoutLine, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { ReadMoreButtonState, ReadMoreProps } from '@holi/ui/components/molecules/HoliReadMore.shared'
import { colors } from '@holi/ui/styles/globalVars'

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore: React.FunctionComponent<ReadMoreProps> = ({
  children,
  numberOfLines = 3,
  style,
  fontStyle,
  buttonStyle,
}) => {
  const [truncatedText, setTruncatedText] = useState(children || '')
  const [buttonState, setButtonState] = useState<ReadMoreButtonState>('hidden')
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
  const truncateText = useCallback(
    ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
      // ignore truncating when there is no hidden text (no need for a Read more button)
      if (lines.length < numberOfLines) {
        setButtonState('hidden')
        return
      }

      // get the length of the first line as a base to truncate the text
      const firstLineLength = lines[0].text.length

      // check wether truncating was necessary
      let truncated = false

      const truncatedText = lines
        .map((line: TextLayoutLine, index: number) => {
          const { text } = line
          const maxAllowedLastLineLength =
            firstLineLength - readMoreButtonTextLength * bufferTextFactor - ellipsisLength

          // if we are in the last visible line, truncate it in case its text is too long (longer or equal to the length of first line minus the button text length)
          if (numberOfLines - 1 === index && text.length >= maxAllowedLastLineLength) {
            // only display Read More button if truncating was needed
            truncated = true

            return text.substring(0, maxAllowedLastLineLength) + ellipsis
          }

          // disconsider any lines beyond numberOfLines for the truncated text
          if (index > numberOfLines - 1) {
            return ''
          }

          return text
        })
        .join('')

      // if truncating the text was required, set the button state to 'readMore'
      if (truncated) {
        setButtonState('readMore')
      } else {
        setButtonState('hidden')
      }

      setTruncatedText(truncatedText)
    },
    [ellipsisLength, numberOfLines, readMoreButtonTextLength]
  )

  const toggleButtonState = useCallback(() => {
    setButtonState((previousState) => (previousState === 'readMore' ? 'readLess' : 'readMore'))
  }, [])

  // using a Text as the button, due to vertical aligning issues on Android https://github.com/facebook/react-native/issues/27549
  const ToggleButton = (
    <Text onPress={toggleButtonState} accessible={true} accessibilityRole="button" style={buttonStyle || {}}>
      {buttonState === 'readMore' ? readMoreButtonText : readLessButtonText}
    </Text>
  )

  return (
    <View style={style || {}}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        // TODO(SF) correct?
        onTextLayout={buttonState !== 'hidden' ? truncateText : undefined}
        numberOfLines={buttonState !== 'readLess' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText style={[{ color: colors.fontColorGrey }, fontStyle || {}]}>
          {buttonState === 'readMore' ? truncatedText : children} {buttonState === 'readLess' && ' '}
        </HoliText>

        {/* show button inline (mobile only) */}
        {buttonState !== 'hidden' && ToggleButton}
      </Text>
    </View>
  )
}

export default HoliReadMore
