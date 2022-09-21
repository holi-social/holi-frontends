import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TextLayoutEventData, TextLayoutLine, TextProps, TextStyle, View, ViewStyle } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type ReadMoreProps = HoliTextProps &
  TextProps & {
    numberOfLines?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined // 1 line is not supported on Android and in this component
    style?: ViewStyle
    fontStyle?: TextStyle
    buttonStyle?: TextStyle | Record<string, unknown>
  }

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
  const [truncatedText, setTruncatedText] = React.useState(children || '')
  const [buttonType, setButtonType] = React.useState<'show' | 'hide' | undefined>(undefined)
  const { t } = useTranslation()

  const hideButtonText = t('component.readMore.readLess')

  // needed for its length calculation
  const showButtonText = t('component.readMore.readMore')
  const { length: showButtonTextLength } = showButtonText

  // buffer factor to truncate the text for extra space (showButtonTextLength * bufferTextFactor)
  const bufferTextFactor = 2

  // render a custom ellipsis for the truncated text
  const ellipsis = '... '
  const { length: ellipsisLength } = ellipsis

  // for mobile only: onTextLayout is not supported on web - https://github.com/necolas/react-native-web/issues/1685
  const truncateText = ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
    // ignore truncating when there is no hidden text (no need for a Read more button)
    if (!numberOfLines || lines.length < numberOfLines) {
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
        const maxAllowedLastLineLength = firstLineLength - showButtonTextLength * bufferTextFactor - ellipsisLength

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

    // if truncating the text was required, set the button to 'show' type (read more)
    if (truncated) {
      setButtonType('show')
    } else {
      setButtonType(undefined)
    }

    setTruncatedText(truncatedText)
  }

  const toggleButtonType = () => {
    setButtonType((previousType) => (previousType === 'show' ? 'hide' : 'show'))
  }

  // using a Text as the button, due to vertical aligning issues on Android https://github.com/facebook/react-native/issues/27549
  const ToggleButton = (
    <Text onPress={toggleButtonType} accessible={true} accessibilityRole="button" style={buttonStyle || {}}>
      {buttonType === 'show' ? showButtonText : hideButtonText}
    </Text>
  )

  return (
    <View style={style || {}}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onTextLayout={!buttonType ? truncateText : undefined}
        numberOfLines={buttonType === 'show' ? numberOfLines : undefined} // only pass numberOfLines when the Read More button is present
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText style={[{ color: colors.fontColorGrey }, fontStyle || {}]}>
          {buttonType === 'show' ? truncatedText : children} {buttonType === 'hide' && ' '}
        </HoliText>

        {/* show button inline (mobile only) */}
        {buttonType && ToggleButton}
      </Text>
    </View>
  )
}

export default HoliReadMore
