import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'
import { BorderRadius } from 'holi-bricks/tokens'

export const HoliSwitchSizes = ['small', 'medium', 'large'] as const
export type HoliSwitchSize = (typeof HoliSwitchSizes)[number]
export interface HoliSwitchProps {
  value: boolean
  onChange?: (value: boolean) => void
  size?: HoliSwitchSize
  disabled?: boolean
  duration?: number
  testID?: string
}

const HoliSwitch: React.FC<HoliSwitchProps> = ({
  value,
  onChange,
  size = 'medium',
  disabled = false,
  duration = 300,
  testID,
}) => {
  const { theme } = useTheme()
  const { colors } = theme
  const { width, height, circleSize, circlePosXEnd, circlePosXStart } = getSizeStyles(size)
  const styles = getStyles()

  // const circlePosXEnd = 44
  // const circlePosXStart = 4
  const prevSwitchOnRef = useRef<boolean>()
  const prevSwitchOn = !!prevSwitchOnRef.current
  const [animXValue] = useState(new Animated.Value(value ? 1 : 0))

  useEffect(() => {
    const runAnimation = (): void => {
      const animValue = {
        fromValue: value ? 0 : 1,
        toValue: value ? 1 : 0,
        duration,
        useNativeDriver: false,
      }
      Animated.timing(animXValue, animValue).start()
    }
    prevSwitchOnRef.current = value
    if (prevSwitchOn !== value) runAnimation()
  }, [prevSwitchOn, value, animXValue, duration])

  const handleOnPress = (): void => {
    if (disabled) return
    onChange?.(!value)
  }

  let circleColor: string = colors.background10
  let backgroundColor: string = value ? colors.brandB300 : colors.gray300

  if (disabled) {
    circleColor = colors.background10
    backgroundColor = colors.foreground10
  }

  return (
    <TouchableOpacity testID={testID} onPress={handleOnPress} activeOpacity={0.8} disabled={disabled}>
      <Animated.View style={[styles.container, { width, height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              backgroundColor: circleColor,
              borderRadius: circleSize / 2,
              transform: [
                {
                  translateX: animXValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [circlePosXStart, circlePosXEnd] as number[],
                  }),
                },
              ],
            },
          ]}
        >
          {value ? (
            <HoliIcon icon={Check} colorOverride={colors.brandB300} size={circleSize} />
          ) : (
            <HoliIcon icon={Close} colorOverride={colors.gray300} size={circleSize} />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
}

const getSizeStyles = (size: HoliSwitchSize) => {
  switch (size) {
    case 'large':
      return { width: 80, height: 40, circleSize: 32, circlePosXEnd: 44, circlePosXStart: 4 }
    case 'small':
      return { width: 40, height: 20, circleSize: 16, circlePosXEnd: 22, circlePosXStart: 2 }
    default: // medium
      return { width: 60, height: 30, circleSize: 24, circlePosXEnd: 33, circlePosXStart: 3 }
  }
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: BorderRadius.xl,
    },
    circle: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      height: 32,
      width: 32,
    },
  })

export default HoliSwitch
