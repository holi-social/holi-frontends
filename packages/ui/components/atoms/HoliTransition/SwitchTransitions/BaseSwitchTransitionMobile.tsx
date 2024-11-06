import React from 'react'
import { ViewProps } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { LayoutAnimationConfig } from 'react-native-reanimated'

// eslint-disable-next-line no-restricted-imports
import { HoliSwitchTransitionProps } from '../types'

export const BaseSwitchTransitionMobile = ({
  animKey,
  children,
  entering,
  exiting,
  style,
}: HoliSwitchTransitionProps & Pick<AnimatedProps<ViewProps>, 'entering' | 'exiting'>) => {
  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View key={animKey} entering={entering} exiting={exiting} style={[style, { zIndex: 9999 }]}>
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  )
}
