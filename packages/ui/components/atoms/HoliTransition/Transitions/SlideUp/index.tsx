import React from 'react'
import { SlideInUp, SlideOutUp } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const SlideUp = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={SlideInUp.createInstance()} exiting={SlideOutUp.createInstance()} />
)
