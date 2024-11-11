import React from 'react'
import { SlideInDown, SlideOutDown } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const SlideDown = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={SlideInDown.createInstance()} exiting={SlideOutDown.createInstance()} />
)
