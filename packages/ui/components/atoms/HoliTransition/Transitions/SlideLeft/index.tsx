import React from 'react'
import { SlideInLeft, SlideOutLeft } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const SlideLeft = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={SlideInLeft.createInstance()} exiting={SlideOutLeft.createInstance()} />
)
