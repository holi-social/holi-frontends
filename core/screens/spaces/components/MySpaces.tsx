import React from 'react'
// import { useTranslation } from 'react-i18next'
import { SectionList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import DiscoverSpaces from '@holi/core/screens/spaces/components/DiscoverSpaces'
import { MySpacesResponse } from '@holi/core/screens/spaces/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type MySpacesProps = {
  mySpaces: MySpacesResponse
  user?: User
  style?: StyleProp<ViewStyle>
}
const MySpaces: React.VFC<MySpacesProps> = ({ mySpaces = [], user, style }) => {
  //   const { t } = useTranslation()
  const mixins = useStyleMixins()

  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      data: section.spaces.data,
    }
  })

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
              <SectionList
                sections={mappedSpaces}
                renderItem={({ item }) => (
                  <HoliBlockItem
                    key={item.id}
                    label={item.title}
                    title={item.title}
                    subtitle={item.location}
                    description={item.description}
                    imageSrc={item.mainImage}
                    users={item.memberships.map((membership) => membership.user)}
                    href={`/spaces/${item.id}`}
                    size="small"
                    testID="space-link"
                  />
                )}
                renderSectionHeader={({ section }) => (
                  <HoliHeading level="3" size="small">
                    {section.title}
                  </HoliHeading>
                )}
                keyExtractor={(space) => `space-${space.id}`}
              />
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
