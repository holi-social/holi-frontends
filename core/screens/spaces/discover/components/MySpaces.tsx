import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceMineTile from '@holi/core/screens/spaces/discover/components/SpaceMineTile'
import { SpaceSection } from '@holi/core/screens/spaces/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}

const MySpaces = ({ mySpaces = [], style }: MySpacesProps) => {
  const { t } = useTranslation()

  // FIXME: this will be very expensive when spaces start growing.
  // If we need a better API this should be changed on the backend.
  const mappedSpaces = mySpaces.map((section) => ({
    title: t(`spaces.tabs.mine.${section.section.toLowerCase()}`),
    type: section.type,
    data: section.spaces.data,
  }))

  return (
    <View style={[styles.container, style]}>
      {mappedSpaces.map((section, sectionIndex) => (
        <View key={`${sectionIndex}`} style={styles.section}>
          <HoliHeading level="3" size="s" testID={`section-headline-${section.type}`}>
            {section.title}
          </HoliHeading>

          {section.data.map((space, spaceIndex) => (
            <SpaceMineTile
              space={space}
              sectionType={section.type}
              key={`${sectionIndex}-${space.name}-${spaceIndex}`}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

export default MySpaces

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
})
