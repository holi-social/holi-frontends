import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceSocialLinkList from '@holi/core/screens/spaces/components/SpaceSocialLinkList'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import SpaceTaskList from './SpaceTaskList'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceDetailView: React.VFC<SpaceDetailViewProps> = ({ space, style }) => {
  const mixins = useStyleMixins()

  return (
    <View style={[styles.wrapper, style]} testID="space-details-container">
      {/* Header */}
      <View style={styles.header}>
        <SpaceHeader space={space} style={mixins.container} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Welcome */}
        <SpaceWelcome space={space} style={mixins.container} />

        {/* Ways to Act Act */}
        {space.tasks && space.tasks.length > 0 && (
          <SpaceTaskList style={[mixins.container, styles.tasks]} space={space} />
        )}

        {/* Social Links */}
        <SpaceSocialLinkList space={space} style={[mixins.container, styles.socialLinks]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    paddingTop: 12,
    height: '100%',
  },
  header: {
    backgroundColor: colors.backgroundColorWhite,
    paddingBottom: 24,
  },
  body: {
    paddingTop: 24,
    paddingBottom: 100,
    backgroundColor: colors.backgroundColorGrey,
  },
  tasks: {
    marginTop: 64,
  },
  socialLinks: {
    marginTop: 64,
  },
})

export default SpaceDetailView
