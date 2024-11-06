import React from 'react'
import { FadeInDown, FadeOutDown } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliSwitchTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseSwitchTransitionMobile } from '../BaseSwitchTransitionMobile'

export const FadeDownSwitch = (props: HoliSwitchTransitionProps) => (
  <BaseSwitchTransitionMobile {...props} entering={FadeInDown.delay(200)} exiting={FadeOutDown} />
)
