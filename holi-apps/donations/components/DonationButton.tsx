import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Easing, GestureResponderEvent, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type DonationButtonProps = {
  icon: string
  iconSpinning?: boolean
  label: string
  bold?: boolean
  disabled?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: ViewStyle | ViewStyle[]
}

const DonationButton = ({
  icon,
  label,
  iconSpinning = false,
  disabled = false,
  ...props
}: React.PropsWithChildren<DonationButtonProps>) => {
  const { t } = useTranslation()

  const spinValue = new Animated.Value(0)

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: iconSpinning,
    })
  ).start(() => {
    spinValue.setValue(0)
  })

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })
  return (
    <View style={props.style}>
      <HoliButton label={t(label)} disabled={disabled}>
        <HoliText bold={props.bold} style={{ marginRight: 6, borderColor: colors.borderColorBlack }}>
          {t(label)}
        </HoliText>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <HoliIcon icon={icon} size={16} />
        </Animated.View>
      </HoliButton>
    </View>
  )
}

export default DonationButton
