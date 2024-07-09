import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliLocationExternalAppLink, HoliMap, HoliPin } from '@holi/core/components/HoliMap'
import InfoModal from '@holi/core/components/InfoModal'
import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'
import { SDG_INFO_MODAL_SOURCES_MAPPING } from '@holi/core/screens/spaces/edit/EditSpace'
import { Space } from '@holi/core/screens/spaces/types'
import { termsBySortNumberComparator } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { At, Phone } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
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
          {space.geolocation && (
            <>
              <HoliLocationExternalAppLink location={space.geolocation} />
              <View style={{ width: '100%', aspectRatio: 1.5, marginTop: dimensions.spacingS }}>
                <View
                  style={{
                    borderRadius: 16,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.gray200,
                    backgroundColor: theme.colors.white100,
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <View style={{ borderRadius: 8, overflow: 'hidden', height: '100%', width: '100%' }}>
                    <HoliMap center={space.geolocation}>
                      <HoliPin location={space.geolocation} />
                    </HoliMap>
                  </View>
                </View>
              </View>
            </>
          )}
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
