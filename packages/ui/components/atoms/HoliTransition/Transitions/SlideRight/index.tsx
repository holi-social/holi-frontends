import React from 'react'
import { SlideInRight, SlideOutRight } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const SlideRight = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={SlideInRight.createInstance()} exiting={SlideOutRight.createInstance()} />
)
