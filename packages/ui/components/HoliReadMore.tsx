import * as React from 'react'
import {
  AccessibilityProps,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextLayoutLine,
  TextProps,
  TextStyle,
  View,
} from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliText, { HoliTextProps } from '@holi/ui/components/HoliText'
import theme, { HoliTheme } from '@holi/ui/styles/theme'

type ReadMoreProps = HoliTextProps &
  TextProps & {
    children: string
    numberOfLines?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined // 1 line is not supported on Android and in this component
    label?: string
    styles?: TextStyle | TextStyle[]
  }

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore: React.FunctionComponent<ReadMoreProps> = (props: ReadMoreProps) => {
  const defaultNumberOfLines = 3
  const [truncatedText, setTruncatedText] = React.useState(props.children || '')
  const [activeButton, setActiveButton] = React.useState<'show' | 'hide' | undefined>(undefined)
  const [numberOfLines, setNumberOfLines] = React.useState<number | undefined>(
    props.numberOfLines || defaultNumberOfLines
  )
  const styles = getStyles(theme)
  const isWeb = Platform.OS === 'web'

  const hideButtonText = 'Read less'

  // needed for its length calculation
  const showButtonText = 'Read more'
  const { length: showButtonTextLength } = showButtonText

  // buffer factor to truncate the text for extra space (showButtonTextLength * bufferTextFactor)
  const bufferTextFactor = 2

  // render a custom ellipsis for the truncated text
  const ellipsis = '... '
  const { length: ellipsisLength } = ellipsis

  // for mobile only: onTextLayout is not supported on web - https://github.com/necolas/react-native-web/issues/1685
  const truncateText = ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
    // ignore truncating when there is no hidden text (no need for a Read more button)
    if (!lines || !lines.length || !lines[0].text.length || !numberOfLines || lines.length < numberOfLines) {
      setNumberOfLines(undefined)
      setActiveButton(undefined)
      return
    }

    // get the length of the first line as a base to truncate the text
    const firstLineLength = lines[0].text.length

    // check wether truncating was necessary
    let truncated = false

    const truncatedText = lines
      .map((line: TextLayoutLine, index: number) => {
        const { text } = line

        // if we are in the last visible line, truncate it in case its text is too long (longer or equal to the length of first line minus the button text length)
        if (
          numberOfLines - 1 === index &&
          text.length >= firstLineLength - showButtonTextLength * bufferTextFactor - ellipsisLength
        ) {
          // only display Read More button if truncating was needed
          truncated = true

          return (
            text.substring(0, firstLineLength - showButtonTextLength * bufferTextFactor - ellipsisLength) + ellipsis
          )
        }

        // disconsider any lines beyond numberOfLines for the truncated text
        if (index > numberOfLines - 1) {
          return ''
        }

        return text
      })
      .join('')

    // if truncating the text was required, set the button to 'show' type (read more)
    if (truncated) {
      setActiveButton('show')
    } else {
      setNumberOfLines(undefined)
      setActiveButton(undefined)
    }

    setTruncatedText(truncatedText)
  }

  // for web only
  const showWebButtons = (event: LayoutChangeEvent) => {
    // nativeEvent.target is Web only. Cast it as unknown and then as its proper type in this context
    const nativeEvent = event.nativeEvent as unknown as {
      target: { clientHeight: number; scrollHeight: number; offsetHeight: number }
    }
    const target = nativeEvent.target

    // check if ellipsis is active
    if (target.clientHeight < target.scrollHeight) {
      setNumberOfLines(props.numberOfLines || defaultNumberOfLines)
      setActiveButton('show')
    } else if (activeButton === 'show') {
      // if ellipsis is not active and the current button is 'show' (window size changed) remove button completely
      setActiveButton(undefined)
    }
  }

  // for all platforms
  const toggleActiveButton = () => {
    if (activeButton === 'show') {
      setNumberOfLines(undefined)
      setActiveButton('hide')
    } else {
      setNumberOfLines(props.numberOfLines || defaultNumberOfLines)
      setActiveButton('show')
    }
  }

  const ToggleButton = (
    <HoliButton
      label={activeButton === 'show' ? showButtonText : hideButtonText}
      onPress={toggleActiveButton}
      variant={'transparent'}
      style={[
        { margin: -1.5, lineHeight: 16 * 1.2 },
        isWeb && activeButton === 'show' ? styles.buttonReadMoreWeb : {},
        isWeb && activeButton === 'hide' ? styles.buttonReadLessWeb : {},
      ]}
    >
      <HoliText>
        {isWeb && activeButton === 'show' ? '...' : ''}
        {activeButton === 'show' ? showButtonText : hideButtonText}
      </HoliText>
    </HoliButton>
  )

  return (
    <View style={[isWeb && { position: 'relative' }]}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onTextLayout={!activeButton ? truncateText : undefined}
        onLayout={isWeb ? showWebButtons : undefined}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText
          styles={[
            { color: theme.colors.fontColorGrey },
            ...(props.styles ? (Array.isArray(props.styles) ? props.styles : [props.styles]) : []),
          ]}
        >
          {numberOfLines && !isWeb ? truncatedText : props.children} {activeButton === 'hide' && !isWeb && ' '}
        </HoliText>

        {/* show button inline (mobile only) */}
        {!isWeb && activeButton && ToggleButton}
      </Text>
      {/* show button in new line (web only) */}
      {isWeb && activeButton && ToggleButton}
    </View>
  )
}

export default HoliReadMore

// no usage of StyleSheet.create in these styles, to force the inline styles on Web
const getStyles = (theme: HoliTheme) => ({
  button: {
    margin: -1.5,
  },
  buttonReadMoreWeb: {
    position: 'absolute',
    right: 0,
    bottom: 1.5,
    paddingHorizontal: 20,
    backgroundImage: `linear-gradient(to right, transparent , ${theme.colors.backgroundColor} 15%)`,
  },
  buttonReadLessWeb: {
    marginTop: 1.5,
  },
})
