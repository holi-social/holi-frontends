import type React from 'react'
import { type SyntheticEvent, useState } from 'react'
import { type GestureResponderEvent, type NativeMouseEvent, type NativeSyntheticEvent, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ReactionSupportColored, ReactionSupport, ReactionSupportOutline } from '@holi/icons/src/generated'

export type MouseEnterOutEvent = NativeSyntheticEvent<NativeMouseEvent>

export interface PostReactionCountProps {
  active?: boolean
  onPress: (event: SyntheticEvent | GestureResponderEvent) => void
  label: string
}

const PostReactionCount: React.FC<PostReactionCountProps> = ({ active = false, onPress, label }) => {
  const [hovered, setHovered] = useState(false)

  const icon = active
    ? hovered
      ? ReactionSupportColored
      : ReactionSupport
    : hovered
      ? ReactionSupportColored
      : ReactionSupportOutline

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  }, [scale])

  const handlePress = (event: SyntheticEvent | GestureResponderEvent) => {
    scale.value = withSpring(1.5, {}, () => {
      scale.value = withSpring(1)
    })
    onPress(event)
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

export default PostReactionCount
