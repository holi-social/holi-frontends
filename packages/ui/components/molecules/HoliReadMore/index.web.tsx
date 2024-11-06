import type { PropsWithChildren } from 'react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Will be resolved with HOLI-10365
// eslint-disable-next-line no-restricted-imports
import { GestureResponderEvent, LayoutChangeEvent, Text, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { ReadMoreButtonState, ReadMoreProps } from '@holi/ui/components/molecules/HoliReadMore/shared'
import { styles } from '@holi/ui/components/molecules/HoliReadMore/shared'

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliReadMore = ({
  children,
  onReadMoreSideEffect,
  onReadLessSideEffect,
  numberOfLines = 3,
  ...textProps
}: PropsWithChildren<ReadMoreProps>) => {
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

  const toggleButtonState = useCallback(
    (event: React.SyntheticEvent | GestureResponderEvent) => {
      try {
        if (buttonState === 'readMore') onReadMoreSideEffect?.()
        if (buttonState === 'readLess') onReadLessSideEffect?.()
      } finally {
        event.preventDefault()
        event.stopPropagation()
        setButtonState((previousState) => (previousState === 'readMore' ? 'readLess' : 'readMore'))
      }
    },
    [buttonState, onReadMoreSideEffect, onReadLessSideEffect]
  )

  const buttonLabel = buttonState === 'readMore' ? readMoreButtonText : readLessButtonText

  return (
    <View style={{ position: 'relative' }}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onLayout={updateButtonState}
        numberOfLines={buttonState !== 'readLess' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={styles.textContainer}
      >
        {/* The visible text. Any font style props and remaining textProps are applied here */}
        <HoliText size="small" {...textProps}>
          {children}
        </HoliText>
      </Text>
      {buttonState !== 'hidden' && (
        <View style={[styles.readMoreWeb]}>
          <HoliButton label={buttonLabel} onPress={toggleButtonState} transparent>
            <HoliText color="black300" bold align="right">
              {buttonLabel}
            </HoliText>
          </HoliButton>
        </View>
      )}
    </View>
  )
}

export default HoliReadMore
