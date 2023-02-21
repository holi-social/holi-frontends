import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

type SpaceShareProps = {
  style?: StyleProp<ViewStyle>
}

const SpaceShare: React.VFC<SpaceShareProps> = ({ style }: SpaceShareProps) => {
  return <View style={style}>SpaceShare</View>
}

export default SpaceShare
