import React from 'react'
import Animated, { type BaseAnimationBuilder } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import type { HoliTransitionProps } from '../types'

const DELAY = 150

export const BaseTransitionMobile = ({
  visible,
  skipInitialEnter = false,
  index = 0,
  children,
  entering,
  exiting,
  style,
}: HoliTransitionProps & { entering: BaseAnimationBuilder; exiting: BaseAnimationBuilder }) => {
  if (!visible) return null

  return (
    <Animated.View
      entering={skipInitialEnter ? undefined : entering.delay(index * DELAY)}
      exiting={exiting}
      style={[style, { zIndex: 9999 }]}
    >
      {children}
    </Animated.View>
  )
}
