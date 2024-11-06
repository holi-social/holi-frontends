import React from 'react'
import Animated, { BaseAnimationBuilder, LayoutAnimationConfig } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliTransitionProps } from '../types'

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
  return visible ? (
    <LayoutAnimationConfig skipEntering={skipInitialEnter}>
      <Animated.View entering={entering.delay(index * DELAY)} exiting={exiting} style={[style, { zIndex: 9999 }]}>
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  ) : null
}
