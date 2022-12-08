import React, { useCallback, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceCollaborators from '@holi/core/screens/spaces/components/SpaceCollaborators'
import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceSocialLinkList from '@holi/core/screens/spaces/components/SpaceSocialLinkList'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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

  const [modalVisible, setModalVisible] = useState(false)

  const openModal = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

  return (
    <View style={[styles.wrapper, style]} testID="space-details-container">
      {/* Header */}
      <SpaceCollaborators space={space} show={modalVisible} onDismiss={() => setModalVisible(false)} />
      <View style={styles.header}>
        <HoliButton label="Go to space" transparent onPress={openModal}>
          <SpaceHeader space={space} style={mixins.container} />
        </HoliButton>
      </View>

      <HoliTabs
        id="space-tabs"
        centeredButtons
        tabs={[
          {
            title: 'Goals',
            titleIcon: 'pushpin',
            style: styles.tabStyle,
            children: [
              <SpaceWelcome
                space={space}
                style={[mixins.container, styles.tabItem, styles.tabItemFirst]}
                key="space-welcome"
              />,
              <SpaceSocialLinkList
                space={space}
                style={[mixins.container, styles.tabItem]}
                key="space-social-link-list"
              />,
            ],
          },
          {
            title: 'Actions',
            titleIcon: 'sun',
            style: styles.tabStyle,
            children: (
              <SpaceTaskList
                style={[mixins.container, styles.tabItem, styles.tabItemFirst]}
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
  tabItem: {
    paddingBottom: 32,
  },
  tabItemFirst: {
    paddingTop: 32,
  },
  tabStyle: {
    backgroundColor: colors.backgroundColorGrey,
  },
})

export default SpaceDetailView
