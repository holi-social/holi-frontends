import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliHead from '@holi/core/components/HoliHead'
import SpaceHeader from '@holi/core/screens/spaces/details/components/SpaceHeader'
import SpaceInfoView from '@holi/core/screens/spaces/details/components/SpaceInfoView'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceUpdatesTab } from '@holi/core/screens/spaces/updates/components/SpaceUpdatesTab'
import { Flag2, Flag2Filled, Pushpin, PushpinFilled, Sun, SunFilled } from '@holi/icons/src/generated'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import Spacing from '@holi/ui/foundations/Spacing'
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

interface TabItem extends HoliTabItem {
  key: string
  content: () => React.ReactElement
}

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
  activeTab: string
  onTabChange: (key: string) => void
}

const SpaceDetailView = ({ space, activeTab, onTabChange }: SpaceDetailViewProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const data: TabItem[] = useMemo(
    () => [
      {
        key: SpaceDetailsTabs.INFO,
        tabTitle: t('spaces.tab.info'),
        tabIcons: [Pushpin, PushpinFilled],
        content: () => <SpaceInfoView space={space} style={styles.tabItem} />,
      },
      {
        key: SpaceDetailsTabs.UPDATES,
        tabTitle: t('spaces.tab.updates'),
        tabIcons: [Flag2, Flag2Filled],
        content: () => <SpaceUpdatesTab space={space} style={styles.tabItem} />,
      },
      {
        key: SpaceDetailsTabs.INVOLVEMENT,
        tabTitle: t('spaces.tab.action'),
        tabIcons: [Sun, SunFilled],
        content: () => <SpaceInvolvement style={styles.tabItem} space={space} key="space-involvement" />,
      },
    ],
    [space, styles.tabItem, t]
  )

  return (
    <>
      <HoliHead
        title={space.title}
        description={space.description}
        ogTitle={space.title}
        ogDescription={space.description}
        ogImage={space.cover}
      />
      <View style={styles.wrapper} testID="space-details-container">
        <View style={styles.header}>
          <SpaceHeader space={space} style={mixins.container} />
        </View>

        <HoliTabs
          data={data}
          keyExtractor={({ key }) => key}
          renderTabContent={({ item }) => item.content()}
          activeTab={activeTab}
          onChange={onTabChange}
          centeredTabButtons
          backgroundColor={colors.background20}
          testID="space-tabs"
        />
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      justifyContent: 'center',
      paddingTop: Spacing.xxs,
      backgroundColor: theme.colors.background10,
    },
    header: {
      backgroundColor: theme.colors.background10,
      paddingBottom: Spacing.md,
    },
    tabItem: {
      paddingTop: Spacing.xs,
      paddingBottom: Spacing['4xl'],
    },
    tabStyle: {
      backgroundColor: theme.colors.background20,
      paddingBottom: Platform.OS === 'web' ? dimensions.bottomBarHeight : Spacing.md,
    },
  })

export default SpaceDetailView
