import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceSocialLink from '@holi/core/screens/spaces/components/SpaceSocialLink'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceInfoViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceInfoView: React.VFC<SpaceInfoViewProps> = ({ space, style }: SpaceInfoViewProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  return (
    <View style={style}>
      <SpaceWelcome space={space} style={[mixins.container]} />
      {space.location && (
        <SpaceSection title={t('spaces.spaceDetails.location')}>
          <HoliText>{space.location}</HoliText>
        </SpaceSection>
      )}
      {!!space.topics?.length && (
        <SpaceSection title={t('spaces.spaceDetails.topics')}>
          <View style={styles.listContainer}>
            {
              /** FIXME convert to VirtualizedList, FlatList or SectionList */
              space.topics?.map((topic, index) => (
                <HoliChip key={`topic_${index}`} text={topic.title} label={topic.title} disabled style={styles.chip} />
              ))
            }
          </View>
        </SpaceSection>
      )}
      {!!space.links?.length && (
        <SpaceSection title={t('spaces.links.heading')}>
          <View style={styles.listContainer}>
            {
              /** FIXME convert to VirtualizedList, FlatList or SectionList */
              space.links.map((link, index) => (
                <SpaceSocialLink key={`link_${index}`} link={link} style={styles.link} />
              ))
            }
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
})
