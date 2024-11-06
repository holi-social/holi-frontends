import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../../types'
// eslint-disable-next-line no-restricted-imports
import { BaseTransitionWEB } from '../BaseTransitionWEB'
import './styles.scss'

export const FadeLeft = (props: HoliTransitionProps) => <BaseTransitionWEB {...props} classNames="fade-left" />
