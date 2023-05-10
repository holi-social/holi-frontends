import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceSocialLink from '@holi/core/screens/spaces/components/SpaceSocialLink'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import { termsBySortNumberComparator } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceInfoViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceInfoView: React.VFC<SpaceInfoViewProps> = ({ space, style }: SpaceInfoViewProps) => {
  const { t } = useTranslation()

  const sdgs = space.sdgs ? [...space.sdgs].sort(termsBySortNumberComparator) : []

  const links = space.links || []

  return (
    <View style={style}>
      <SpaceWelcome space={space} />
      {!!space.topics?.length && (
        <SpaceSection title={t('spaces.spaceDetails.topics')}>
          <View style={styles.listContainer}>
            {space.topics?.map((topic, index) => (
              <HoliChip key={`topic_${index}`} text={topic.title} label={topic.title} disabled style={styles.chip} />
            ))}
          </View>
        </SpaceSection>
      )}
      {!!space.location && (
        <SpaceSection title={t('spaces.spaceDetails.location')}>
          <HoliText>{space.location}</HoliText>
        </SpaceSection>
      )}
      {!!sdgs.length && (
        <SpaceSection title={t('spaces.spaceDetails.sdgs')}>
          <View style={styles.listContainer}>
            {sdgs.map((sdg, index) => (
              <HoliChip
                key={`sdg_${index}`}
                text={`${sdg.number}. ${sdg.title}`}
                label={`${sdg.number}. ${sdg.title}`}
                disabled
                style={styles.chip}
              />
            ))}
          </View>
        </SpaceSection>
      )}
      {(!!space.contactDescription || !!space.contactEmail || !!space.contactPhone) && (
        <SpaceSection title={t('spaces.spaceDetails.contact')}>
          <View>
            {!!space.contactDescription && <HoliText>{space.contactDescription}</HoliText>}
            {!!space.contactEmail && (
              <View style={styles.contactContainer}>
                <HoliIcon icon="at" color={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactEmail}
                </HoliText>
              </View>
            )}
            {!!space.contactPhone && (
              <View style={styles.contactContainer}>
                <HoliIcon icon="phone" color={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactPhone}
                </HoliText>
              </View>
            )}
          </View>
        </SpaceSection>
      )}
      {!!links.length && (
        <SpaceSection title={t('spaces.links.heading')}>
          <View style={styles.listContainer}>
            {links.map((link, index) => (
              <SpaceSocialLink key={`link_${index}`} link={link} style={styles.link} />
            ))}
          </View>
        </SpaceSection>
      )}
    </View>
  )
}
export default SpaceInfoView

const styles = StyleSheet.create({
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  chip: {
    backgroundColor: colors.background10,
    marginRight: 8,
    marginBottom: 8,
  },
  link: {
    marginRight: 20,
    marginBottom: 20,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
