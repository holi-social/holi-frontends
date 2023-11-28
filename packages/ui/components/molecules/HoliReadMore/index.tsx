import React, { useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import type { TextLayoutEventData, TextLayoutLine } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { styles } from '@holi/ui/components/molecules/HoliReadMore/shared'
import type { ReadMoreButtonState, ReadMoreProps } from '@holi/ui/components/molecules/HoliReadMore/shared'

/**
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore = ({ children, testID, numberOfLines = 3, ...textProps }: PropsWithChildren<ReadMoreProps>) => {
  const linesRef = useRef<TextLayoutLine[] | undefined>(undefined)
  const [truncatedText, setTruncatedText] = useState(() => children || '')
  const [buttonState, setButtonState] = useState<ReadMoreButtonState>('hidden')

  const { t } = useTranslation()

  const readLessButtonText = t('component.readMore.readLess')

  // needed for its length calculation
  const readMoreButtonText = t('component.readMore.readMore')

  // render a custom ellipsis for the truncated text
  const ellipsis = '…'

  const handleTextLayoutEvent = ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
    if (!lines.length) return

    // Check if there have been layout changes (impacting the width of the rendered text)
    if (lines === linesRef.current) return

    linesRef.current = lines

    // ignore truncating when there is no hidden text (no need for a Read more button)
    if (lines.length <= numberOfLines) {
      return
    }

    const truncatedText = truncateTextByLines(lines, numberOfLines, ellipsis)

    // if truncating the text is required and button was hidden before, set the button state to 'readMore'
    if (buttonState === 'hidden') {
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
        // initially render whole text to know the total lines of the text
        // and afterwards let onTextLayout handle truncating to the correct number of lines
        ellipsizeMode="tail"
        style={styles.textContainer}
        testID={testID}
      >
        {/* The visible text. Any font style props and remaining textProps are applied here */}
        <HoliText testID="holi-readmore-text" color="gray300" {...textProps}>
          {buttonState === 'readMore' ? truncatedText : children} {buttonState === 'readLess' && ' '}
        </HoliText>
      </Text>
      {buttonState !== 'hidden' && (
        <View style={{ alignSelf: 'flex-end' }}>
          <HoliButton transparent color="black300" onPress={handleButtonPress}>
            {buttonState === 'readMore' ? readMoreButtonText : readLessButtonText}
          </HoliButton>
        </View>
      )}
    </>
  )
}

function truncateTextByLines(textLines: TextLayoutLine[], numberOfLines: number, ellipsis: string): string {
  const shortTextLines = textLines.slice(0, numberOfLines)
  const needsEllipsis = shortTextLines.length == numberOfLines
  const shortText = shortTextLines.map((line) => line.text).join('')
  return needsEllipsis ? shortText.replace(/\S*\W+$/, ellipsis) : shortText
}

export default HoliReadMore
