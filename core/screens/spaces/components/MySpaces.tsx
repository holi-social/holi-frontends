import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { SpaceSection } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { colors } from '@holi/ui/styles/globalVars'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}
const MySpaces: React.VFC<MySpacesProps> = ({ mySpaces = [], style }) => {
  // FIXME: this will be very expensive when spaces start growing.
  // If we need a better API this should be changed on the backend.
  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      type: section.type,
      data: section.spaces.data,
    }
  })

  return (
    <View style={[styles.mySpaces, style]}>
      {mappedSpaces.map((section, sectionIndex) => (
        <View key={`${sectionIndex}`} style={styles.section}>
          <HoliHeading level="3" size="small" testID={`section-headline-${section.type}`}>
            {section.title}
          </HoliHeading>

          {section.data.map((space) => (
            <View key={`${sectionIndex}-${space.name}`} style={styles.spaceItemContainer}>
              <HoliBlockItem
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageElement={<SpaceAvatar space={space} size="large" />}
                users={space.members.data.map((membership) => membership.user)}
                href={decodeURI(`/spaces/${space.name}`)}
                type={section.type}
                testID="space-link"
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export default MySpaces

const styles = StyleSheet.create({
  mySpaces: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  spaceItemContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    alignItems: 'center',
  },
  optionsButton: {
    display: 'flex',
    marginRight: 4,
    backgroundColor: colors.background10,
    padding: 6,
    borderRadius: 8,
  },
})
