import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  GestureResponderEvent,
  NativeMouseEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HandHeartThin, HandHeartThinFilledDarker, HandHeartThinFilledRaised } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type MouseEnterOutEvent = NativeSyntheticEvent<NativeMouseEvent>

export interface HoliReactionsCountProps {
  type: 'post' | 'comment' | 'insight'
  fullName?: string
  count?: number
  active?: boolean
  onPress?: (event: SyntheticEvent | GestureResponderEvent) => void
  onMouseEnter?: (event: MouseEnterOutEvent) => void
  onMouseOut?: (event: MouseEnterOutEvent) => void
  style?: ViewStyle
  testID?: string
}

const HoliReactionsCount: React.FC<HoliReactionsCountProps> = ({
  type,
  fullName,
  count = 0,
  active = false,
  onPress = () => null,
  onMouseEnter = () => null,
  onMouseOut = () => null,
  style,
  testID,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
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

  return (
    <HoliButton
      label={labelText}
      onPress={handlePress}
      onMouseEnter={onNativeMouseEnter}
      onMouseOut={onNativeMouseOut}
      transparent
      style={[styles.outer, style]}
      contentStyle={styles.container}
      testID={testID}
    >
      <HoliText
        selectable={false}
        style={[styles.text, (active || hovered) && !theme.dark && { color: theme.colors.black300 }]}
        testID={`${testID}-counter`}
      >
        {count}
      </HoliText>
      <Animated.View style={animatedStyle}>
        <HoliIcon icon={icon} />
      </Animated.View>
    </HoliButton>
  )
}

export default HoliReactionsCount

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    outer: {
      width: 'auto',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: theme.colors.foreground20,
      lineHeight: 24,
      marginRight: 8,
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
