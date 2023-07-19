import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export const HoliSwitchSizes = ['extralarge', 'large', 'default', 'small'] as const
export type HoliSwitchSize = (typeof HoliSwitchSizes)[number]

export interface HoliSwitchProps {
  testID?: string
  switchOn: boolean
  onPress: () => void
  size?: HoliSwitchSize
  backgroundColorOn?: string
  backgroundColorOff?: string
  circleColorOff?: string
  circleColorOn?: string
  duration?: number
  border?: boolean
  borderColor?: string
  disabled?: boolean
}

const HoliSwitch: React.VFC<HoliSwitchProps> = (props) => {
  const {
    backgroundColorOn = colors.brandColorA30,
    backgroundColorOff = colors.brandColorB30,
    circleColorOn = colors.brandColorB30,
    circleColorOff = colors.brandColorA30,
    duration = 300,
    size = 'default',
    border = false,
    borderColor = colors.brandColorB30,
    disabled = false,
  } = props

  const circlePosXEnd = 40
  const circlePosXStart = 0
  const prevSwitchOnRef = useRef<boolean>()
  const prevSwitchOn = !!prevSwitchOnRef.current
  const [animXValue] = useState(new Animated.Value(props.switchOn ? 1 : 0))
  const styles = getStyles()

  useEffect(() => {
    const runAnimation = (): void => {
      const animValue = {
        fromValue: props.switchOn ? 0 : 1,
        toValue: props.switchOn ? 1 : 0,
        duration,
        useNativeDriver: false,
      }
      Animated.timing(animXValue, animValue).start()
    }

    prevSwitchOnRef.current = props.switchOn
    if (prevSwitchOn !== props.switchOn) runAnimation()
  }, [prevSwitchOn, props.switchOn, animXValue, duration])

  return (
    <TouchableOpacity testID={props.testID} onPress={props.onPress} activeOpacity={0.8} disabled={disabled}>
      <Animated.View
        style={[
          styles.container,
          getSizeStyles(size),
          {
            borderWidth: border ? 1 : 0,
            borderColor: border ? borderColor : 'transparent',
            backgroundColor: animXValue.interpolate({
              inputRange: [0, 1],
              outputRange: [backgroundColorOff as string | number, backgroundColorOn as string | number] as
                | string[]
                | number[],
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
                outputRange: [circleColorOff as string | number, circleColorOn as string | number] as
                  | string[]
                  | number[],
              }),
            },
            {
              transform: [
                {
                  translateX: animXValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [circlePosXStart as string | number, circlePosXEnd as string | number] as
                      | string[]
                      | number[],
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
    case 'extralarge':
      return { transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }
    case 'large':
      return { transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }
    case 'small':
      return { transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }
    default:
      return { transform: [{ scaleX: 1 }, { scaleY: 1 }] }
  }
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      width: 80,
      height: 40,
      borderRadius: 25,
      padding: 5,
    },
    circle: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
  })

export default HoliSwitch
