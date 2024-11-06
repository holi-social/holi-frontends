import React from 'react'
import { FadeIn, FadeOut } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const Fade = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={FadeIn.createInstance()} exiting={FadeOut.createInstance()} />
)
