import React, { Suspense, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/details/components/SpaceHeader'
import SpaceInfoView from '@holi/core/screens/spaces/details/components/SpaceInfoView'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import SpaceUpdatesTabLazy from '@holi/core/screens/spaces/updates/components/SpaceUpdatesTab'
import { Flag2, Flag2Filled, Pushpin, PushpinFilled, Sun, SunFilled } from '@holi/icons/src/generated'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
  initialTabIndex?: number
  onChangeTab?: (index: number) => void
}

const SpaceDetailView = ({ space, style, onChangeTab = () => null }: SpaceDetailViewProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  const getInitialTabIndex = useCallback(() => {
    const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
    const { collaborationTools = [] } = space
    const hasInvolvementContent = space?.tasks?.length !== 0 || collaborationTools?.length !== 0

    if (!isMember) {
      return 0
    }
    if (hasInvolvementContent) {
      return 2
    }
    return 1
  }, [space])

  const initialTabIndex = getInitialTabIndex()

  return (
    <View style={[styles.wrapper, style]} testID="space-details-container">
      <View style={styles.header}>
        <SpaceHeader space={space} style={mixins.container} />
      </View>
      <HoliTabs
        id="space-tabs"
        testID="space-tabs"
        centeredButtons
        initialStep={initialTabIndex}
        style={{ flex: 1 }}
        onChangeTab={onChangeTab}
        backgroundColor={colors.background20}
        tabs={[
          {
            title: t('spaces.tab.info'),
            titleIcons: [Pushpin, PushpinFilled],
            style: styles.tabStyle,
            children: <SpaceInfoView space={space} style={[mixins.container, styles.tabItem]} />,
          },
          {
            title: t('spaces.tab.updates'),
            titleIcons: [Flag2, Flag2Filled],
            style: styles.tabStyle,
            children: (
              <Suspense fallback={<HoliLoader />}>
                <SpaceUpdatesTabLazy space={space} style={[mixins.container, styles.tabItem]} />
              </Suspense>
            ),
          },
          {
            title: t('spaces.tab.action'),
            titleIcons: [Sun, SunFilled],
            style: styles.tabStyle,
            children: (
              <SpaceInvolvement style={[mixins.container, styles.tabItem]} space={space} key="space-involvement" />
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
