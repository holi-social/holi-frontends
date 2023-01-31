import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceSocialLinkList from '@holi/core/screens/spaces/components/SpaceSocialLinkList'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
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
        <View style={[mixins.container, styles.infoContainer]}>
          <HoliHeading level="2" style={styles.heading}>
            {t('spaces.spaceDetails.location')}
          </HoliHeading>
          <HoliText>{space.location}</HoliText>
        </View>
      )}
      {!!space.topics?.length && (
        <View style={[mixins.container, styles.infoContainer, styles.topicsContainer]}>
          <HoliHeading level="2" style={styles.heading}>
            {t('spaces.spaceDetails.topics')}
          </HoliHeading>
          <View style={styles.chipsContainer}>
            {
              /** FIXME convert to VirtualizedList, FlatList or SectionList */
              space.topics?.map((topic) => (
                <HoliChip key={topic.id} text={topic.title} label={topic.title} disabled style={styles.chip} />
              ))
            }
          </View>
        </View>
      )}
      <SpaceSocialLinkList space={space} style={[mixins.container, styles.infoContainer]} />
    </View>
  )
}
export default SpaceInfoView

const styles = StyleSheet.create({
  heading: {
    fontWeight: '400',
    marginBottom: 24,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderColorGrey,
    paddingVertical: 32,
  },
  topicsContainer: {
    paddingBottom: 24,
  },
  chipsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  chip: {
    backgroundColor: colors.backgroundColor,
    marginRight: 8,
    marginBottom: 8,
  },
})
