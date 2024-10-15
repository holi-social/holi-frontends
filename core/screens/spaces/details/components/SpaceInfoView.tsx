import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import InfoModal from '@holi/core/components/InfoModal'
import { termsBySortNumberComparator } from '@holi/core/domain/shared/types'
import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'
import { SDG_INFO_MODAL_SOURCES_MAPPING } from '@holi/core/screens/spaces/edit/EditSpace'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { At, Phone } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import Spacing from '@holi/ui/foundations/Spacing'
import ChipLabel from '@holi/ui/no-name/components/chips/ChipLabel'
import { useTheme } from '@holi/ui/styles/theme'

type SpaceInfoViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceInfoView: React.FC<SpaceInfoViewProps> = ({ space, style }: SpaceInfoViewProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(), [])

  const { show: showInfoModal, hide: closeInfoModal, visible: infoModalVisible } = useModalState()
  const partner = SDG_INFO_MODAL_SOURCES_MAPPING['sdg']

  const sdgs = space.sdgs ? [...space.sdgs].sort(termsBySortNumberComparator) : []

  const links = space.links || []

  return (
    <View style={style}>
      <SpaceWelcome space={space} />
      {!!space.topics?.length && (
        <SpaceSection title={t('spaces.spaceDetails.topics')}>
          <View style={styles.listContainer}>
            {space.topics?.map((topic, index) => (
              <ChipLabel key={`topic_${index}`} color="green">
                {topic.title}
              </ChipLabel>
            ))}
          </View>
        </SpaceSection>
      )}

      {space.location && (
        <SpaceSection title={t('spaces.spaceDetails.location')}>
          <HoliText>{space.location}</HoliText>
        </SpaceSection>
      )}

      {!!sdgs.length && (
        <SpaceSection title={t('spaces.spaceDetails.sdgs')} infoIcon onPressInfo={showInfoModal}>
          <View style={styles.listContainer}>
            {sdgs.map((sdg, index) => (
              <ChipLabel key={`sdg_${index}`} color="white">{`${sdg.number}. ${sdg.title}`}</ChipLabel>
            ))}
          </View>
          <InfoModal
            items={{ sdg: partner }}
            show={!!infoModalVisible}
            onDismiss={closeInfoModal}
            i18nPrefix={'spaces.input.sdgs.infoModal'}
          />
        </SpaceSection>
      )}
      {(!!space.contactDescription || !!space.contactEmail || !!space.contactPhone) && (
        <SpaceSection title={t('spaces.spaceDetails.contact')}>
          <View style={styles.contactWrapper}>
            {!!space.contactDescription && <HoliText>{space.contactDescription}</HoliText>}
            {!!space.contactEmail && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={At} color={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactEmail}
                </HoliText>
              </View>
            )}
            {!!space.contactPhone && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={Phone} color={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactPhone}
                </HoliText>
              </View>
            )}
          </View>
        </SpaceSection>
      )}
      {!!links.length && (
        <SpaceSection title={t('spaces.spaceDetails.publicLinks')}>
          <View style={styles.listContainer}>
            {links.map((link, index) => (
              <SpacePublicLink key={`link_${index}`} link={link} style={styles.link} />
            ))}
          </View>
        </SpaceSection>
      )}
    </View>
  )
}
export default SpaceInfoView

const getStyles = () =>
  StyleSheet.create({
    listContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
      gap: Spacing['3xs'],
    },
    link: {
      marginRight: Spacing['sm'],
      marginBottom: Spacing['sm'],
    },
    contactIcon: {
      marginRight: 10,
    },
    contactWrapper: {
      flex: 1,
      gap: Spacing['xs'],
    },
    contactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
