import React from 'react'
import { FadeInUp, FadeOutUp } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import type { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const FadeUp = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={FadeInUp.createInstance()} exiting={FadeOutUp.createInstance()} />
)
