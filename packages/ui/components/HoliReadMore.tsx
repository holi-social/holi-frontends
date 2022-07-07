import * as React from 'react'
import { Text, TextLayoutEventData, TextLayoutLine, TextProps, TextStyle, View, ViewStyle } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/HoliText'
import theme from '@holi/ui/styles/theme'

export type ReadMoreProps = HoliTextProps &
  TextProps & {
    children: string
    numberOfLines?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined // 1 line is not supported on Android and in this component
    label?: string
    style?: TextStyle
    buttonStyle?: TextStyle | Record<string, unknown>
  }

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore: React.FunctionComponent<ReadMoreProps> = (props: ReadMoreProps) => {
  const defaultNumberOfLines = 3
  const [truncatedText, setTruncatedText] = React.useState(props.children || '')
  const [buttonType, setButtonType] = React.useState<'show' | 'hide' | undefined>(undefined)
  const [numberOfLines, setNumberOfLines] = React.useState<number | undefined>(
    props.numberOfLines || defaultNumberOfLines
  )

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
      setButtonType(undefined)
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
      setButtonType('show')
    } else {
      setNumberOfLines(undefined)
      setButtonType(undefined)
    }

    setTruncatedText(truncatedText)
  }

  const togglebuttonType = () => {
    if (buttonType === 'show') {
      setNumberOfLines(undefined)
      setButtonType('hide')
    } else {
      setNumberOfLines(props.numberOfLines || defaultNumberOfLines)
      setButtonType('show')
    }
  }

  // using a Text as the button, due to vertical aligning issues on Android https://github.com/facebook/react-native/issues/27549
  const ToggleButton = (
    <HoliText
      label={buttonType === 'show' ? showButtonText : hideButtonText}
      onPress={togglebuttonType}
      variant={'transparent'}
      accessible={true}
      accessibilityRole="button"
      role="button"
      style={props.buttonStyle || {}}
    >
      {buttonType === 'show' ? showButtonText : hideButtonText}
    </HoliText>
  )

  return (
    <View>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onTextLayout={!buttonType ? truncateText : undefined}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText styles={[{ color: theme.colors.fontColorGrey }, props.style || {}]}>
          {numberOfLines ? truncatedText : props.children} {buttonType === 'hide' && ' '}
        </HoliText>

        {/* show button inline (mobile only) */}
        {buttonType && ToggleButton}
      </Text>
    </View>
  )
}

export default HoliReadMore
