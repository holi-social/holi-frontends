import React from 'react'
import { View } from 'react-native'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

// eslint-disable-next-line no-restricted-imports
import { HoliSwitchTransitionProps } from '../types'

export const BaseSwitchTransitionWEB = ({
  animKey,
  children,
  classNames,
  style,
}: HoliSwitchTransitionProps & { classNames: string }) => {
  return (
    <SwitchTransition>
      <CSSTransition key={animKey} timeout={300} classNames={classNames} unmountOnExit>
        <View style={style}>{children}</View>
      </CSSTransition>
    </SwitchTransition>
  )
}
