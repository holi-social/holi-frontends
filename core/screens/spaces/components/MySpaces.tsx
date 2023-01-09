import React from 'react'
import { SectionList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { SpaceSection } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}
const MySpaces: React.VFC<MySpacesProps> = ({ mySpaces = [], style }) => {
  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      data: section.spaces.data,
    }
  })

  return (
    <SectionList
      style={[styles.mySpaces, style]}
      sections={mappedSpaces}
      renderItem={({ item }) => (
        <View style={styles.spaceItemContainer}>
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
            style={styles.spaceItem}
            testID="space-link"
          />
          {/* Is coming later */}
          <HoliButton label={'not yet implemented'} inline transparent disabled={true} style={styles.optionsButton}>
            <HoliIcon icon="help" size={20} color={colors.fontColorGrey} />
          </HoliButton>
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <HoliHeading level="3" size="small">
          {section.title}
        </HoliHeading>
      )}
      keyExtractor={(space) => `space-${space.id}`}
    />
  )
}

export default MySpaces

const styles = StyleSheet.create({
  mySpaces: {
    flex: 1,
  },
  spaceItemContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  spaceItem: {
    flex: 1,
  },
  optionsButton: {
    display: 'flex',
    marginRight: 10,
    backgroundColor: colors.backgroundColor,
    padding: 6,
    borderRadius: 8,
  },
})
