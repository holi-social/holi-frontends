import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceInfoView from '@holi/core/screens/spaces/components/SpaceInfoView'
import SpaceTaskList from '@holi/core/screens/spaces/components/SpaceTaskList'
import SpaceUpdatesTab from '@holi/core/screens/spaces/components/SpaceUpdatesTab'
import { Space } from '@holi/core/screens/spaces/types'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
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
        style={{ flex: 1 }}
        tabs={[
          {
            title: t('spaces.tab.info'),
            titleIcon: 'pushpin',
            style: styles.tabStyle,
            children: <SpaceInfoView space={space} style={[mixins.container, styles.tabItem]} />,
          },
          {
            title: t('spaces.tab.updates'),
            titleIcon: '',
            style: styles.tabStyle,
            children: (
              <Suspense fallback={<HoliLoader />}>
                <SpaceUpdatesTab space={space} />
              </Suspense>
            ),
          },
          {
            title: t('spaces.tab.action'),
            titleIcon: 'sun',
            style: styles.tabStyle,
            children: <SpaceTaskList style={[mixins.container, styles.tabItem]} space={space} key="space-task-list" />,
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
    backgroundColor: colors.background10,
    paddingBottom: 24,
  },
  tabItem: {
    paddingVertical: 32,
  },
  tabStyle: {
    backgroundColor: colors.background20,
    paddingBottom: Platform.OS === 'web' ? +vars.bottomBarHeight : 24,
  },
})

export default SpaceDetailView
