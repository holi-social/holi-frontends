import React, { useRef } from 'react'
import { View } from 'react-native'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

// eslint-disable-next-line no-restricted-imports
import type { HoliSwitchTransitionProps } from '../types'

export const BaseSwitchTransitionWEB = ({
  animKey,
  children,
  classNames,
  style,
}: HoliSwitchTransitionProps & { classNames: string }) => {
  const nodeRef = useRef(null)

  return (
    <SwitchTransition>
      <CSSTransition nodeRef={nodeRef} key={animKey} timeout={300} classNames={classNames} unmountOnExit>
        <View style={style} ref={nodeRef}>
          {children}
        </View>
      </CSSTransition>
    </SwitchTransition>
  )
}
