import React from 'react'

// eslint-disable-next-line no-restricted-imports
import type { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionWEB } from '../BaseTransitionWEB'
import './styles.scss'

export const FadeUp = (props: HoliTransitionProps) => <BaseTransitionWEB {...props} classNames="fade-up" />
