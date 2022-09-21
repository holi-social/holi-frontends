import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, Text, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { ReadMoreProps } from '@holi/ui/components/molecules/HoliReadMore'
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
  const [buttonType, setButtonType] = React.useState<'show' | 'hide' | undefined>(undefined)
  const { t } = useTranslation()

  const hideButtonText = t('component.readMore.readLess')

  const showButtonText = t('component.readMore.readMore')

  // buffer for comparing scrollHeight and clientHeight - clientHeight may differ +/- 1px
  const marginBuffer = 1

  const showButton = (event: LayoutChangeEvent) => {
    // nativeEvent.target is Web only. Cast it as unknown and then as its proper type in this context
    const nativeEvent = event.nativeEvent as unknown as {
      target: { clientHeight: number; scrollHeight: number }
    }
    const target = nativeEvent.target

    console.log(target.clientHeight, target.scrollHeight - marginBuffer)
    // check if ellipsis is active
    if (target.clientHeight < target.scrollHeight - marginBuffer) {
      setButtonType('show')
    } else if (buttonType === 'show') {
      // if ellipsis is not active and the current button is 'show' (window size changed) remove button completely
      setButtonType(undefined)
    }
  }

  const togglebuttonType = () => {
    if (buttonType === 'show') {
      setButtonType('hide')
    } else {
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
              backgroundImage: `linear-gradient(to right, transparent , ${colors.backgroundColor} 15%)`,
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
        <HoliText style={buttonStyle || {}}>
          {buttonType === 'show' ? '...' : ''}
          {buttonType === 'show' ? showButtonText : hideButtonText}
        </HoliText>
      </HoliButton>
    </View>
  )

  return (
    <View style={[style ? style : {}, { position: 'relative' }]}>
      {/* Use react-native's Text component to encapsulate HoliText components to avoid applying HoliText default styles
      to both text and button */}
      <Text
        onLayout={showButton}
        numberOfLines={buttonType !== 'hide' ? numberOfLines : undefined}
        ellipsizeMode="tail"
        style={{ alignContent: 'flex-start', justifyContent: 'center' }}
      >
        {/* The visible text. Any style props are applied here */}
        <HoliText style={[{ color: colors.fontColorGrey }, fontStyle || {}]}>{children}</HoliText>
      </Text>
      {/* show button in new line (web only) */}
      {buttonType && ToggleButton}
    </View>
  )
}

export default HoliReadMore
