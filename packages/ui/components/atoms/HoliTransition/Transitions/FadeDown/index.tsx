import React from 'react'
import { FadeInDown, FadeOutDown } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionMobile } from '../BaseTransitionMobile'

export const FadeDown = (props: HoliTransitionProps) => (
  <BaseTransitionMobile {...props} entering={FadeInDown.createInstance()} exiting={FadeOutDown.createInstance()} />
)
