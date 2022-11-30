import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceSocialLinkList from '@holi/core/screens/spaces/components/SpaceSocialLinkList'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
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

      <HoliTabs
        id="space-tabs"
        centeredButtons
        tabs={[
          {
            title: 'Goals',
            children: [
              <SpaceWelcome space={space} style={[mixins.container, styles.subtitleMargin]} key="space-welcome" />,
              <SpaceSocialLinkList
                space={space}
                style={[mixins.container, styles.subtitleMargin, styles.pageBottom]}
                key="space-social-link-list"
              />,
            ],
          },
          {
            title: 'Actions',
            children: space.tasks && space.tasks.length > 0 && (
              <SpaceTaskList
                style={[mixins.container, styles.subtitleMargin, styles.pageBottom]}
                space={space}
                key="space-task-list"
              />
            ),
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    paddingTop: 12,
  },
  header: {
    backgroundColor: colors.backgroundColorWhite,
    paddingBottom: 24,
  },
  subtitleMargin: {
    marginTop: 32,
  },
  pageBottom: {
    paddingBottom: 32,
  },
})

export default SpaceDetailView
