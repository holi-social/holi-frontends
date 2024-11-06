import React from 'react'
import { FadeInLeft, FadeOutLeft } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const FadeLeft = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={FadeInLeft.createInstance()} exiting={FadeOutLeft.createInstance()} />
)
