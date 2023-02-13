import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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
  style = {},
  fontStyle = {},
  buttonStyle = {},
  ...textProps
}) => {
  const [buttonState, setButtonState] = useState<ReadMoreButtonState>('hidden')
  const { t } = useTranslation()

  const readLessButtonText = t('component.readMore.readLess')

  const readMoreButtonText = t('component.readMore.readMore')

  // buffer for comparing scrollHeight and clientHeight - clientHeight may differ +/- 1px
  const marginBuffer = 1

  const updateButtonState = useCallback(
    (event: LayoutChangeEvent) => {
      // nativeEvent.target is Web only. Cast it as unknown and then as its proper type in this context
      const nativeEvent = event.nativeEvent as unknown as {
        target: { clientHeight: number; scrollHeight: number }
      }
      const target = nativeEvent.target

      // check if ellipsis is active
      if (target.clientHeight < target.scrollHeight - marginBuffer) {
        setButtonState('readMore')
      } else if (buttonState === 'readMore') {
        // if ellipsis is not active and the current button is 'readMore' (window size changed) remove button completely
        // but leave "readLess" as it is to avoid flickering
        setButtonState('hidden')
      }
    },
    [buttonState]
  )

  const toggleButtonState = useCallback(() => {
    setButtonState((previousState) => (previousState === 'readMore' ? 'readLess' : 'readMore'))
  }, [])

  const buttonLabel = buttonState === 'readMore' ? readMoreButtonText : readLessButtonText
  const ToggleButton = (
    <View style={styles[buttonState]}>
      <HoliButton label={buttonLabel} onPress={toggleButtonState} transparent>
        <HoliText style={buttonStyle}>
          {buttonState === 'readMore' ? '...' : ''}
          {buttonLabel}
        </HoliText>
      </HoliButton>
    </View>
  )

  return (
    <View style={[style, { position: 'relative' }]}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onLayout={updateButtonState}
        numberOfLines={buttonState !== 'readLess' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={styles.textContainer}
      >
        {/* The visible text. Any font style props and remaining textProps are applied here */}
        <HoliText style={[{ color: colors.foreground20 }, fontStyle]} {...textProps}>
          {children}
        </HoliText>
      </Text>
      {/* show button in new line (web only) */}
      {buttonState !== 'hidden' && ToggleButton}
    </View>
  )
}

export default HoliReadMore

const styles = StyleSheet.create({
  textContainer: {
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  readMore: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingLeft: 34,
    paddingRight: 20,
    backgroundImage: `linear-gradient(to right, transparent , ${colors.background10} 15%)`,
  },
  readLess: {
    width: 'fit-content',
    marginTop: 1.5,
  },
  hidden: {},
})
