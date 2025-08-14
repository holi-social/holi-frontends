import React, { useRef } from 'react'
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
  const nodeRef = useRef(null)

  return (
    <SwitchTransition>
      <CSSTransition key={animKey} nodeRef={nodeRef} timeout={300} classNames={classNames} unmountOnExit>
        <View ref={nodeRef} style={style}>
          {children}
        </View>
      </CSSTransition>
    </SwitchTransition>
  )
}
