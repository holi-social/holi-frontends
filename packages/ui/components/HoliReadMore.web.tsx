import { ReadMoreProps } from 'packages/ui/components/HoliReadMore'
import * as React from 'react'
import { LayoutChangeEvent, Text, View } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import theme, { HoliTheme } from '@holi/ui/styles/theme'

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
  const styles = getStyles(theme)

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
    <HoliButton
      label={buttonType === 'show' ? showButtonText : hideButtonText}
      onPress={togglebuttonType}
      variant={'transparent'}
      style={[
        buttonType === 'show' ? styles.buttonReadMoreWeb : {},
        buttonType === 'hide' ? styles.buttonReadLessWeb : {},
      ]}
    >
      <HoliText>
        {buttonType === 'show' ? '...' : ''}
        {buttonType === 'show' ? showButtonText : hideButtonText}
      </HoliText>
    </HoliButton>
  )

  return (
    <View style={{ position: 'relative' }}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onLayout={showButton}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText
          styles={[
            { color: theme.colors.fontColorGrey },
            ...(props.styles ? (Array.isArray(props.styles) ? props.styles : [props.styles]) : []),
          ]}
        >
          {props.children}
        </HoliText>
      </Text>
      {/* show button in new line (web only) */}
      {buttonType && ToggleButton}
    </View>
  )
}

export default HoliReadMore

// no usage of StyleSheet.create in these styles, to force the inline styles on Web
const getStyles = (theme: HoliTheme) => ({
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
