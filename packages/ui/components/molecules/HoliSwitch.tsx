import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'

import { useTheme } from '@holi/ui/styles/theme'

export const HoliSwitchSizes = ['small', 'medium', 'large'] as const
export type HoliSwitchSize = (typeof HoliSwitchSizes)[number]
export interface HoliSwitchProps {
  switchOn: boolean
  onPress?: () => void
  size?: HoliSwitchSize
  disabled?: boolean
  circleColor?: string
  backgroundColor?: string
  duration?: number
  testID?: string
}

const HoliSwitch: React.FC<HoliSwitchProps> = ({
  switchOn,
  onPress,
  size = 'medium',
  circleColor,
  backgroundColor,
  disabled = false,
  duration = 300,
  testID,
}) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = getStyles()

  const circlePosXEnd = 44
  const circlePosXStart = 4
  const [on, setOn] = useState(switchOn)
  const prevSwitchOnRef = useRef<boolean>()
  const prevSwitchOn = !!prevSwitchOnRef.current
  const [animXValue] = useState(new Animated.Value(on ? 1 : 0))

  useEffect(() => {
    const runAnimation = (): void => {
      const animValue = {
        fromValue: on ? 0 : 1,
        toValue: on ? 1 : 0,
        duration,
        useNativeDriver: false,
      }
      Animated.timing(animXValue, animValue).start()
    }
    prevSwitchOnRef.current = on
    if (prevSwitchOn !== on) runAnimation()
  }, [prevSwitchOn, on, animXValue, duration])

  const handleOnPress = (): void => {
    if (disabled) return
    setOn(!on)
    onPress && onPress()
  }

  if (disabled) {
    circleColor = colors.background10
    backgroundColor = colors.foreground10
  } else {
    circleColor = circleColor || colors.background10
    backgroundColor = backgroundColor || colors.brandB300
  }

  return (
    <TouchableOpacity testID={testID} onPress={handleOnPress} activeOpacity={0.8} disabled={disabled}>
      <Animated.View
        style={[
          styles.container,
          getSizeStyles(size),
          {
            borderWidth: 0,
            borderColor: 'transparent',
            backgroundColor: animXValue.interpolate({
              inputRange: [0, 1],
              outputRange: [backgroundColor || colors.background10, backgroundColor || colors.background10],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            getSizeStyles(size),
            {
              backgroundColor: animXValue.interpolate({
                inputRange: [0, 1],
                outputRange: [circleColor, circleColor] as string[] | number[],
              }),
            },
            {
              transform: [
                {
                  translateX: animXValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [circlePosXStart, circlePosXEnd] as string[] | number[],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const getSizeStyles = (size: HoliSwitchSize) => {
  switch (size) {
    case 'large':
      return { transform: [{ scaleX: 1 }, { scaleY: 1 }] }
    case 'small':
      return { transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }
    default: // medium
      return { transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }
  }
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 80,
      height: 40,
      borderRadius: 100,
    },
    circle: {
      width: 32,
      height: 32,
      borderRadius: 100,
    },
  })

export default HoliSwitch
