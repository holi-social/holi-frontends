import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { SpaceSection, SpaceSectionType } from '@holi/core/screens/spaces/types'
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
  const { t } = useTranslation()
  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      type: section.type,
      data: section.spaces.data,
    }
  })

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <View style={[styles.mySpaces, style]}>
      {mappedSpaces.map((section, sectionIndex) => (
        <View key={`${sectionIndex}`} style={styles.section}>
          <HoliHeading level="3" size="small" testID={`section-headline-${section.type}`}>
            {section.title}
          </HoliHeading>

          {section.data.map((space) => (
            <View key={`${sectionIndex}-${space.id}`} style={styles.spaceItemContainer}>
              <HoliBlockItem
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageSrc={space.mainImage}
                users={space.memberships.map((membership) => membership.user)}
                href={`/spaces/${space.id}`}
                size="small"
                style={styles.spaceItem}
                testID="space-link"
              />
              {/* Is coming later */}
              {(section.type === SpaceSectionType.MEMBER || section.type === SpaceSectionType.CREATOR) && (
                <HoliButton
                  label={t('global.notAvailable')}
                  inline
                  transparent
                  onPress={showFeatureNotImplementedToast}
                  style={styles.optionsButton}
                >
                  <HoliIcon icon="tools" size={20} color={colors.fontColorGrey} />
                </HoliButton>
              )}
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
    marginTop: 16,
    alignItems: 'center',
  },
  spaceItem: {
    flex: 1,
  },
  optionsButton: {
    display: 'flex',
    marginRight: 4,
    backgroundColor: colors.backgroundColor,
    padding: 6,
    borderRadius: 8,
  },
})
