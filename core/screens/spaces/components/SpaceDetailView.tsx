import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceInfoView from '@holi/core/screens/spaces/components/SpaceInfoView'
import SpaceTaskList from '@holi/core/screens/spaces/components/SpaceTaskList'
import SpaceUpdatesTabLazy from '@holi/core/screens/spaces/components/SpaceUpdatesTab'
import { Space } from '@holi/core/screens/spaces/types'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
  onChangeTab?: (index: number) => void
}

const SpaceDetailView: React.VFC<SpaceDetailViewProps> = ({ space, style, onChangeTab = () => null }) => {
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
        onChangeTab={onChangeTab}
        tabs={[
          {
            title: t('spaces.tab.info'),
            titleIcon: 'pushpin',
            style: styles.tabStyle,
            children: <SpaceInfoView space={space} style={[mixins.container, styles.tabItem]} />,
          },
          {
            title: t('spaces.tab.updates'),
            titleIcon: 'flag-2',
            style: styles.tabStyle,
            children: (
              <Suspense fallback={<HoliLoader />}>
                <SpaceUpdatesTabLazy space={space} />
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
