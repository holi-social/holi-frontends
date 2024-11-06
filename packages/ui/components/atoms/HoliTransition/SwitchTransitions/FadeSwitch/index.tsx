import React from 'react'
import { FadeIn, FadeOut } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliSwitchTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseSwitchTransitionMobile } from '../BaseSwitchTransitionMobile'

export const FadeSwitch = (props: HoliSwitchTransitionProps) => (
  <BaseSwitchTransitionMobile {...props} entering={FadeIn.delay(200)} exiting={FadeOut} />
)
