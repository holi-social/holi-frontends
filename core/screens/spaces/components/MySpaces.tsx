import React from 'react'
// import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import DiscoverSpaces from '@holi/core/screens/spaces/components/DiscoverSpaces'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type MySpacesProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}
const MySpaces: React.VFC<MySpacesProps> = ({ user, style }) => {
  //   const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <HoliTabs
      id="space-tabs"
      style={[styles.holiTabs, style]}
      tabs={[
        {
          title: 'Mine',
          style: styles.tabStyle,
          children: (
            <View style={[mixins.container, styles.tabContentContainer]}>
              <HoliText>My spaces</HoliText>
            </View>
          ),
        },
        {
          title: 'Discover',
          style: styles.tabStyle,
          children: (
            <View style={[mixins.container, styles.tabContentContainer]}>
              <DiscoverSpaces user={user} />
            </View>
          ),
        },
      ]}
    />
  )
}

export default MySpaces

const styles = StyleSheet.create({
  holiTabs: {
    flex: 1,
  },
  tabStyle: {
    minHeight: '100%',
    backgroundColor: colors.backgroundColorGrey,
  },
  tabContentContainer: {
    marginTop: 24,
  },
})
