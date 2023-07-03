/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { Animated, Easing, StyleProp, StyleSheet, View } from 'react-native'
import { ImageStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'

import { ICONSET_FILLED, ICONSET_REGULAR } from '@holi/ui/assets/img/icons/HoliIcons/Iconset'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliIconProps = {
  icon: string
  spinning?: boolean
  color?: string
  filled?: boolean
  size?: number
  testID?: string
  style?: StyleProp<ImageStyle>
}

const HoliIcon: React.VoidFunctionComponent<HoliIconProps> = (props: HoliIconProps) => {
  const icon = !props.filled ? ICONSET_REGULAR[props.icon] : ICONSET_FILLED[props.icon]
  const size = props?.size || 24
  const styling = {
    color: props?.color || colors.foreground30,
    borderStyle: 'solid',
    borderWidth: 0,
    ...StyleSheet.flatten<ImageStyle>(props?.style),
  }

  if (props.spinning) {
    const spinValue = new Animated.Value(0)
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start(() => {
      spinValue.setValue(0)
    })
    return (
      <Animated.View testID={props.testID} style={{ ...(props.spinning && { transform: [{ rotate: spin }] }) }}>
        <HoliLocalImage {...props} imageSource={icon} label={''} width={size} height={size} isSvg style={styling} />
      </Animated.View>
    )
  }

  return (
    <View testID={props.testID}>
      <HoliLocalImage {...props} imageSource={icon} label={''} width={size} height={size} isSvg style={styling} />
    </View>
  )
}

export default HoliIcon
