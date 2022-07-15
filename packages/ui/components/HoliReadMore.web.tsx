import * as React from 'react'
import { LayoutChangeEvent, Text, View } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import { ReadMoreProps } from '@holi/ui/components/HoliReadMore'
import HoliText from '@holi/ui/components/HoliText'
import theme from '@holi/ui/styles/theme'

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore: React.FunctionComponent<ReadMoreProps> = (props: ReadMoreProps) => {
  const defaultNumberOfLines = 3
  const [buttonType, setButtonType] = React.useState<'show' | 'hide' | undefined>(undefined)
  const [numberOfLines, setNumberOfLines] = React.useState<number | undefined>(
    props.numberOfLines || defaultNumberOfLines
  )

  const hideButtonText = 'Read less'

  const showButtonText = 'Read more'

  const showButton = (event: LayoutChangeEvent) => {
    // nativeEvent.target is Web only. Cast it as unknown and then as its proper type in this context
    const nativeEvent = event.nativeEvent as unknown as {
      target: { clientHeight: number; scrollHeight: number; offsetHeight: number }
    }
    const target = nativeEvent.target

    // check if ellipsis is active
    if (target.clientHeight < target.scrollHeight) {
      setNumberOfLines(props.numberOfLines || defaultNumberOfLines)
      setButtonType('show')
    } else if (buttonType === 'show') {
      // if ellipsis is not active and the current button is 'show' (window size changed) remove button completely
      setButtonType(undefined)
    }
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

  const ToggleButton = (
    <View
      style={{
        ...(buttonType === 'show'
          ? {
              position: 'absolute',
              right: 0,
              bottom: 0,
              paddingHorizontal: 20,
              backgroundImage: `linear-gradient(to right, transparent , ${theme.colors.backgroundColor} 15%)`,
            }
          : {}),
        ...(buttonType === 'hide'
          ? {
              width: 'fit-content',
              marginTop: 1.5,
            }
          : {}),
      }}
    >
      <HoliButton
        label={buttonType === 'show' ? showButtonText : hideButtonText}
        onPress={togglebuttonType}
        transparent
      >
        <HoliText style={props.buttonStyle || {}}>
          {buttonType === 'show' ? '...' : ''}
          {buttonType === 'show' ? showButtonText : hideButtonText}
        </HoliText>
      </HoliButton>
    </View>
  )

  return (
    <View style={[props.style ? props.style : {}, { position: 'relative' }]}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onLayout={showButton}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText style={[{ color: theme.colors.fontColorGrey }, props.fontStyle || {}]}>{props.children}</HoliText>
      </Text>
      {/* show button in new line (web only) */}
      {buttonType && ToggleButton}
    </View>
  )
}

export default HoliReadMore
