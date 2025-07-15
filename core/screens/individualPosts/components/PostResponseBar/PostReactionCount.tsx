import type React from 'react'
import { type SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type GestureResponderEvent,
  type NativeMouseEvent,
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  HandHeartThinFilledDarker,
  HandHeartThinFilledRaised,
  ReactionSupport,
  ReactionSupportOutline,
  SupportReaction,
} from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Text } from 'holi-bricks/components/text'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'

export type MouseEnterOutEvent = NativeSyntheticEvent<NativeMouseEvent>

export interface PostReactionCountProps {
  type: 'post' | 'comment' | 'insight'
  fullName?: string
  count?: number
  active?: boolean
  onPress?: (event: SyntheticEvent | GestureResponderEvent) => void
  onCountPress?: (event: SyntheticEvent | GestureResponderEvent) => void
  onMouseEnter?: (event: MouseEnterOutEvent) => void
  onMouseOut?: (event: MouseEnterOutEvent) => void
  style?: ViewStyle
  testID?: string
  showCount?: boolean
}

const PostReactionCount: React.FC<PostReactionCountProps> = ({
  type,
  fullName,
  count = 0,
  active = false,
  onPress = () => null,
  onCountPress = () => null,
  onMouseEnter = () => null,
  onMouseOut = () => null,
  showCount = true,
  style,
  testID,
}) => {
  const { t } = useTranslation()
  const styles = useMemo(() => getStyles(), [])
  const [hovered, setHovered] = useState(false)

  const notActiveText = fullName
    ? t(`insights.reactions.${type}.like`, { name: fullName })
    : t(`insights.reactions.${type}.like.noUser`)
  const activeText = t(`insights.reactions.${type}.unlike`)
  const labelText = active ? activeText : notActiveText

  const onNativeMouseEnter = useCallback(
    (event: NativeSyntheticEvent<NativeMouseEvent> | MouseEnterOutEvent) => {
      setHovered(true)
      onMouseEnter?.(event as MouseEnterOutEvent)
    },
    [onMouseEnter, setHovered]
  )

  const onNativeMouseOut = useCallback(
    (event: NativeSyntheticEvent<NativeMouseEvent> | MouseEnterOutEvent) => {
      setHovered(false)
      onMouseOut?.(event as MouseEnterOutEvent)
    },
    [onMouseOut, setHovered]
  )

  const icon = active
    ? hovered
      ? HandHeartThinFilledRaised // active and hovered
      : ReactionSupport // active and !hovered
    : hovered
      ? HandHeartThinFilledDarker // !active and hovered
      : ReactionSupportOutline // !active and !hovered

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  }, [scale])

  const handlePress = useCallback(
    (event: SyntheticEvent | GestureResponderEvent) => {
      scale.value = withSpring(1.5, {}, () => {
        scale.value = withSpring(1)
      })
      onPress(event)
    },
    [onPress, scale]
  )

  const handleCountPress = useCallback(
    (event: SyntheticEvent | GestureResponderEvent) => {
      onCountPress(event)
    },
    [onCountPress]
  )

  if (showCount && count === 0) {
    return <View style={[styles.outer, style, { height: 26 }]} />
  }

  return (
    <View style={[styles.outer, style]}>
      {showCount && (
        <HoliButton
          label={t('insights.reactions.post.viewReactions')}
          onPress={handleCountPress}
          transparent
          style={styles.countButton}
          testID={`${testID}-count-button`}
        >
          <View style={styles.text}>
            <Text
              selectable={false}
              size="xs"
              colorOverride={lightTheme.colors.fill.default}
              testID={`${testID}-counter`}
              bold
            >
              {count}
            </Text>
          </View>
        </HoliButton>
      )}
      <HoliButton
        label={labelText}
        onPress={handlePress}
        onMouseEnter={onNativeMouseEnter}
        onMouseOut={onNativeMouseOut}
        transparent
        style={styles.iconButton}
        contentStyle={styles.iconContainer}
        testID={`${testID}-icon-button`}
      >
        <Animated.View style={animatedStyle}>
          {showCount ? <HoliIcon icon={SupportReaction} size={26} /> : <HoliIcon icon={icon} size={24} />}
        </Animated.View>
      </HoliButton>
    </View>
  )
}

export default PostReactionCount

const getStyles = () =>
  StyleSheet.create({
    outer: {
      width: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countButton: {
      width: 'auto',
    },
    iconButton: {
      width: 'auto',
    },
    iconContainer: {
      alignItems: 'center',
    },
    text: {
      marginRight: 4,
      marginBottom: -2,
    },
    visuallyHidden: {
      ...Platform.select({
        native: {
          display: 'none',
        },
        default: {
          // only hiding the element on web to prefetch the icon within first network call
          visibility: 'hidden',
          position: 'fixed',
        },
      }),
    },
  })
