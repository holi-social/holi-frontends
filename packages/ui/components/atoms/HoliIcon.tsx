/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import IcoMoon from 'react-icomoon'
import { Animated, Easing, Platform } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type HoliIconProps = {
  icon: string
  spinning?: boolean
  color?: string
  filled?: boolean
  size?: number
  testID?: string
  style?: React.CSSProperties
}

const HoliIcon: React.VoidFunctionComponent<HoliIconProps> = (props: HoliIconProps) => {
  const iconSet = props?.filled
    ? require('@holi/ui/assets/fonts/HoliIcons/filled/selection.json')
    : require('@holi/ui/assets/fonts/HoliIcons/regular/selection.json')

  const mobileProps =
    Platform.OS === 'web'
      ? {}
      : {
          native: true,
          SvgComponent: require('react-native-svg').Svg,
          PathComponent: require('react-native-svg').Path,
        }

  const icoMoonProps = { size: 24, ...props }
  delete icoMoonProps.filled

  const spinValue = new Animated.Value(0)

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start(() => {
    spinValue.setValue(0)
  })

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <>
      {props?.spinning ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <IcoMoon
            iconSet={iconSet}
            style={{ color: props?.color || colors.fontColorBlack }}
            {...mobileProps}
            {...icoMoonProps}
          />
        </Animated.View>
      ) : (
        <IcoMoon
          iconSet={iconSet}
          style={{ color: props?.color || colors.fontColorBlack }}
          {...mobileProps}
          {...icoMoonProps}
        />
      )}
    </>
  )
}

export default HoliIcon
