import React from 'react'
import { useState } from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ReactionSupport, ReactionSupportOutline } from '@holi/icons/src/generated'

export interface ReactButtonProps {
  active?: boolean
  onPress: () => void
  label: string
}

const ReactButton = ({ active = false, onPress, label }: ReactButtonProps) => {
  const [hovered, setHovered] = useState(false)

  const icon = hovered ? ReactionSupport : active ? ReactionSupport : ReactionSupportOutline

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  }, [scale])

  const handlePress = () => {
    scale.value = withSpring(1.5, {}, () => {
      scale.value = withSpring(1)
    })
    onPress()
  }

  return (
    <Pressable
      aria-label={label}
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <Animated.View style={animatedStyle}>
        <HoliIcon icon={icon} size={24} />
      </Animated.View>
    </Pressable>
  )
}

export default ReactButton
