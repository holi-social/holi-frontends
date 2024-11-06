import React from 'react'
import { FadeInRight, FadeOutRight } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliSwitchTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseSwitchTransitionMobile } from '../BaseSwitchTransitionMobile'

export const FadeRightSwitch = (props: HoliSwitchTransitionProps) => (
  <BaseSwitchTransitionMobile {...props} entering={FadeInRight.delay(200)} exiting={FadeOutRight} />
)
