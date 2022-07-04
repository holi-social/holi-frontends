import * as React from 'react'
import { Text, TextLayoutEventData, TextLayoutLine, TextProps, TextStyle } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/HoliText'
import theme from '@holi/ui/styles/theme'

export type ChipProps = HoliTextProps &
  TextProps & {
    children: string
    text?: string
    label?: string
    maxLength?: number
    maxLines?: number
    styles?: TextStyle | TextStyle[]
  }

const HoliReadMore: React.FunctionComponent<ChipProps> = (props: ChipProps) => {
  const [visibleText, setVisibleText] = React.useState(props.children || '')
  const [showButton, setShowButton] = React.useState(false)
  const [numberOfLines, setNumberOfLines] = React.useState<number | undefined>(props.numberOfLines || 3)

  // needed for its length calculation
  const buttonText = 'Read more'
  const { length: buttonTextLength } = buttonText

  const ellipsis = '... '
  const { length: ellipsisLength } = ellipsis

  const truncateLastVisibleLine = ({ nativeEvent: { lines } }: { nativeEvent: TextLayoutEventData }) => {
    // ignore truncating when there is no hidden text (no need for a Read more button)
    if (!lines || !lines.length || !lines[0].text.length || !numberOfLines || lines.length < numberOfLines) {
      setNumberOfLines(undefined)
      setShowButton(false)
      return
    }

    // get the length of the first line as a base to truncate the last line
    const firstLineLength = lines[0].text.length

    // variable to check wether truncating the last line was necessary
    let truncated = false

    const truncatedText = lines
      .map((line: TextLayoutLine, index: number) => {
        const { text } = line
        // if we are in the last visible line, truncate it in case its text is too long (longer or equal to the length of first line minus the button text length)
        if (numberOfLines - 1 === index && text.length >= firstLineLength - buttonTextLength - ellipsisLength) {
          // only display Read More button if truncating was needed
          truncated = true
          setShowButton(true)
          console.log('truncating')

          return text.substring(0, firstLineLength - buttonTextLength - ellipsisLength) + ellipsis
        }
        return text
      })
      .join('')

    // if truncating the last line wasn't required, hide the read more button
    if (!truncated) {
      setNumberOfLines(undefined)
      setShowButton(false)
    }

    setVisibleText(truncatedText)
  }

  return (
    // Use a react-native Text component to encapsulate HoliText components to avoid applying HoliText default styles to both text and button
    <Text onTextLayout={truncateLastVisibleLine} numberOfLines={numberOfLines} ellipsizeMode="tail">
      {/* The visible text. Any style props are applied here */}
      <HoliText
        styles={[
          ...(props.styles ? (Array.isArray(props.styles) ? props.styles : [props.styles]) : []),
          { color: theme.colors.fontColorGrey },
        ]}
      >
        {numberOfLines ? visibleText : props.children}
      </HoliText>

      {showButton && (
        <HoliText
          onPress={() => {
            setNumberOfLines(undefined)
            setShowButton(false)
          }}
          styles={{ fontWeight: '900', color: theme.colors.fontColorBlack }}
        >
          Read more
        </HoliText>
      )}
    </Text>
  )
}

export default HoliReadMore
