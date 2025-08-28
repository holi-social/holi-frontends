import React, { useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import type { TextLayoutEventData, TextLayoutLine } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { truncateTextByLines } from '@holi/ui/components/molecules/HoliReadMore/shared'

const NotificationContentText = ({
  children,
  testID,
  numberOfLines = 3,
  ...textProps
}: PropsWithChildren<HoliTextProps>) => {
  const linesRef = useRef<TextLayoutLine[] | undefined>(undefined)
  const [truncatedText, setTruncatedText] = useState(() => children || '')
  const [showFullText, setShowFullText] = useState(false)

  const ellipsis = '\u2026'

  const handleTextLayoutEvent = ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
    if (!lines.length) return

    if (lines === linesRef.current) return

    linesRef.current = lines

    if (lines.length <= numberOfLines) {
      return
    }

    const truncatedText = truncateTextByLines(lines, numberOfLines, ellipsis)

    if (!showFullText) {
      setShowFullText(false)
    }

    setTruncatedText(truncatedText)
  }

  return (
    <>
      <HoliText
        onTextLayout={handleTextLayoutEvent}
        numberOfLines={showFullText ? undefined : numberOfLines}
        ellipsizeMode="tail"
        style={styles.textContainer}
        testID={testID}
        color="gray300"
      >
        <HoliText testID="notification-content-text" {...textProps}>
          {showFullText ? children : truncatedText}
        </HoliText>
      </HoliText>
    </>
  )
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

export default NotificationContentText
