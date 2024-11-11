/* eslint-disable no-restricted-imports */
import React, { useRef } from 'react'
import { View } from 'react-native'
import { CSSTransition } from 'react-transition-group'

import { HoliTransitionProps } from '../types'

const DELAY = 150
const TIMEOUT = 300

export const BaseTransitionWEB = ({
  visible,
  index = 0,
  skipInitialEnter = false,
  children,
  classNames,
  style,
}: HoliTransitionProps & { classNames: string }) => {
  const nodeRef = useRef(null)

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={visible}
      appear={!skipInitialEnter}
      timeout={DELAY * index + TIMEOUT}
      classNames={classNames}
      unmountOnExit
    >
      <View ref={nodeRef} style={style}>
        {children}
      </View>
    </CSSTransition>
  )
}
