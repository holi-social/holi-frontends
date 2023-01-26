import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, Text, View } from 'react-native'

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
  style,
  fontStyle,
  buttonStyle,
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

  const ToggleButton = (
    <View
      style={{
        ...(buttonState === 'readMore'
          ? {
              position: 'absolute',
              right: 0,
              bottom: 0,
              paddingHorizontal: 20,
              backgroundImage: `linear-gradient(to right, transparent , ${colors.backgroundColor} 15%)`,
            }
          : {}),
        ...(buttonState === 'readLess'
          ? {
              width: 'fit-content',
              marginTop: 1.5,
            }
          : {}),
      }}
    >
      <HoliButton
        label={buttonState === 'readMore' ? readMoreButtonText : readLessButtonText}
        onPress={toggleButtonState}
        transparent
      >
        <HoliText style={buttonStyle || {}}>
          {buttonState === 'readMore' ? '...' : ''}
          {buttonState === 'readMore' ? readMoreButtonText : readLessButtonText}
        </HoliText>
      </HoliButton>
    </View>
  )

  return (
    <View style={[style ? style : {}, { position: 'relative' }]}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onLayout={updateButtonState}
        numberOfLines={buttonState !== 'readLess' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText style={[{ color: colors.fontColorGrey }, fontStyle || {}]}>{children}</HoliText>
      </Text>
      {/* show button in new line (web only) */}
      {buttonState && ToggleButton}
    </View>
  )
}

export default HoliReadMore
