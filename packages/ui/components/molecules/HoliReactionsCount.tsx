import type React from 'react'
import { type SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type GestureResponderEvent,
  type NativeMouseEvent,
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  type ViewStyle,
  View,
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  HandHeartThin,
  HandHeartThinFilledDarker,
  HandHeartThinFilledRaised,
  SupportReaction,
} from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Text } from 'holi-bricks/components/text'
import Spacing from '@holi/ui/foundations/Spacing'

// color only used for this component
export const REACTION_PINK_COLOR = '#D47BC5'

export type MouseEnterOutEvent = NativeSyntheticEvent<NativeMouseEvent>

export interface HoliReactionsCountProps {
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
  text?: string
}

const HoliReactionsCount: React.FC<HoliReactionsCountProps> = ({
  type,
  fullName,
  count = 0,
  active = false,
  onPress = () => null,
  onCountPress = () => null,
  onMouseEnter = () => null,
  onMouseOut = () => null,
  style,
  testID,
  text,
}) => {
  const { t } = useTranslation()
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
      : HandHeartThinFilledDarker // active and !hovered
    : hovered
      ? HandHeartThinFilledDarker // !active and hovered
      : HandHeartThin // !active and !hovered

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

  return (
    <View style={[styles.outer, style]}>
      {!text && (
        <HoliButton
          label={t('global.like')}
          onPress={handleCountPress}
          transparent
          style={styles.countButton}
          testID={`${testID}-count-button`}
        >
          <Text
            selectable={false}
            size="md"
            color={active || hovered ? 'main' : 'default'}
            testID={`${testID}-counter`}
          >
            {count}
          </Text>
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
        {text && (
          <Text size="sm" color={'main'} colorOverride={active ? REACTION_PINK_COLOR : undefined} bold>
            {text}
          </Text>
        )}
        {text ? (
          <></>
        ) : (
          <Animated.View style={animatedStyle}>
            <HoliIcon icon={icon} size={Spacing.md} />
          </Animated.View>
        )}
      </HoliButton>
      {!!text && !!count && (
        <HoliButton
          label={t('global.like')}
          onPress={handleCountPress}
          transparent
          style={styles.countButton}
          testID={`${testID}-count-button`}
          contentStyle={styles.iconContainer}
        >
          <HoliIcon icon={SupportReaction} size={26} />
          <Text selectable={false} size="xs" color={hovered ? 'main' : 'default'} testID={`${testID}-counter`}>
            {count}
          </Text>
        </HoliButton>
      )}
    </View>
  )
}

export default HoliReactionsCount

const styles = StyleSheet.create({
  outer: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
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
    flexDirection: 'row',
    gap: Spacing['4xs'],
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
