import React from 'react'
import { FadeInRight, FadeOutRight } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const FadeRight = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={FadeInRight.createInstance()} exiting={FadeOutRight.createInstance()} />
)
