import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'

import { Space } from '@holi/core/screens/spaces/types'

type SpacesGridProps = {
  spaces: Space[]
  style?: StyleProp<ViewStyle>
}

const SpacesGrid: React.VFC<SpacesGridProps> = ({ spaces, style }: SpacesGridProps) => {
  return (
    <View style={[style]}>
      {spaces.map((space) => (
        <Text key={space.id}>{space.title}</Text>
      ))}
    </View>
  )
}

export default SpacesGrid
