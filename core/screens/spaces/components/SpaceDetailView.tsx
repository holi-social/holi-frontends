import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceSocialLinkList from '@holi/core/screens/spaces/components/SpaceSocialLinkList'
import SpaceTaskList from '@holi/core/screens/spaces/components/SpaceTaskList'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceDetailView: React.VFC<SpaceDetailViewProps> = ({ space, style }) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
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
            title: t('spaces.tab.info'),
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
            title: t('spaces.tab.action'),
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
