import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import SpaceMineTile from '@holi/core/screens/spaces/discover/components/SpaceMineTile'
import type { SpaceSection } from '@holi/core/screens/spaces/types'
import { Spacing } from 'holi-bricks/tokens'
import { Text } from 'holi-bricks/components/text'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}

const MySpaces = ({ mySpaces = [], style }: MySpacesProps) => {
  const { t } = useTranslation()

  // FIXME: this will be very expensive when spaces start growing.
  // If we need a better API this should be changed on the backend.
  const mappedSpaces = mySpaces.map((section) => ({
    title: t(`spaces.tabs.mine.${section.type.toLowerCase()}`),
    type: section.type,
    data: section.spaces.data,
  }))

  return (
    <View style={[styles.container, style]}>
      {mappedSpaces.map((section, sectionIndex) => (
        <View key={`${sectionIndex}`} style={styles.section}>
          <View testID={`section-headline-${section.type}`}>
            <Text headingLevel="3" size="lg">
              {section.title}
            </Text>
          </View>

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
    paddingBottom: Spacing.md,
    paddingHorizontal: Platform.OS !== 'web' ? Spacing.xs : 0,
  },
  section: {
    marginTop: Spacing.md,
  },
})
