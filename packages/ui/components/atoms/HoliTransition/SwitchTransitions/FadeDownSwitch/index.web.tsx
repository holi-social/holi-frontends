import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { HoliSwitchTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseSwitchTransitionWEB } from '../BaseSwitchTransitionWEB'
import './styles.scss'

export const FadeDownSwitch = (props: HoliSwitchTransitionProps) => (
  <BaseSwitchTransitionWEB {...props} classNames="fade-down-switch" />
)
