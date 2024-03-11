import React, { Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/details/components/SpaceHeader'
import SpaceInfoView from '@holi/core/screens/spaces/details/components/SpaceInfoView'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { Space } from '@holi/core/screens/spaces/types'
import SpaceUpdatesTabLazy from '@holi/core/screens/spaces/updates/components/SpaceUpdatesTab'
import { Flag2, Flag2Filled, Pushpin, PushpinFilled, Sun, SunFilled } from '@holi/icons/src/generated'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export enum SpaceDetailsTabs {
  INFO = 'info',
  UPDATES = 'updates',
  INVOLVEMENT = 'involvement',
}
export const SPACE_DETAILS_TABS_IN_ORDER: string[] = [
  SpaceDetailsTabs.INFO,
  SpaceDetailsTabs.UPDATES,
  SpaceDetailsTabs.INVOLVEMENT,
]

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
  initialTabIndex?: number
  onChangeTabIndex: (index: number) => void
}

const SpaceDetailView = ({ space, style, initialTabIndex, onChangeTabIndex }: SpaceDetailViewProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
        onChangeTab={onChangeTabIndex}
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      justifyContent: 'center',
      paddingTop: 12,
    },
    header: {
      backgroundColor: theme.colors.background10,
      paddingBottom: 24,
    },
    tabItem: {
      paddingVertical: 32,
    },
    tabStyle: {
      backgroundColor: theme.colors.background20,
      paddingBottom: Platform.OS === 'web' ? dimensions.bottomBarHeight : 24,
    },
  })

export default SpaceDetailView
