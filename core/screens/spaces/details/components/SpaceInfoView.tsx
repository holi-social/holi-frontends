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
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type SpaceInfoViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceInfoView: React.FC<SpaceInfoViewProps> = ({ space, style }: SpaceInfoViewProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
              <HoliChip key={`topic_${index}`} text={topic.title} label={topic.title} disabled style={styles.chip} />
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
              <HoliChip
                key={`sdg_${index}`}
                text={`${sdg.number}. ${sdg.title}`}
                label={`${sdg.number}. ${sdg.title}`}
                disabled
                style={styles.chip}
              />
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    listContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
    },
    chip: {
      backgroundColor: theme.colors.background10,
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
    contactWrapper: {
      flex: 1,
      gap: 16,
    },
    contactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
