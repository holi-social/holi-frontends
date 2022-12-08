import React from 'react'
import {
  ScrollView,
  StyleProp,
  /* StyleSheet ,*/
  View,
  ViewStyle,
} from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { Space } from '@holi/core/screens/spaces/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'

//import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceCollaboratorsProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceCollaborators: React.VFC<SpaceCollaboratorsProps> = ({ space /* style */ }) => {
  return (
    <DefaultLayout>
      {/* Header */}
      <ScrollView>
        <View>
          <HoliImage source={{ uri: space.avatar }} style={{ width: 100, height: 100 }} label={''} />
          <HoliText>{space.title}</HoliText>
          <HoliText>{space.description}</HoliText>
        </View>
      </ScrollView>
    </DefaultLayout>
  )
}

//const styles = StyleSheet.create({})

export default SpaceCollaborators
