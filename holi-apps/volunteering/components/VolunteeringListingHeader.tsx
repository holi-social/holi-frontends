import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import InfoModal from '@holi/core/components/InfoModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'

interface VolunteeringListingHeaderProps {
  isFiltering?: boolean
  filterSubtitle: string
}
export const VolunteeringListingHeader = ({ isFiltering, filterSubtitle }: VolunteeringListingHeaderProps) => {
  const { t } = useTranslation()
  const subtitle = useRecosSubtitle()
  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View>
      <HoliHeading level="2" size="l">
        {t('volunteering:discoveryV1.headline')}
      </HoliHeading>
      <HoliGap size="s" />
      <PartnerInfoRow
        rowText={t('volunteering:listing.subline')}
        showOutlinkIcon={false}
        partners={allPartners}
        onPress={showPartnerModal}
      />
      <InfoModal
        headline={t('volunteering:listing.partnerModal.headline')}
        items={allPartners}
        shown={partnerModalVisible}
        onDismiss={closeModal}
        i18nPrefix={'volunteering:listing.partnerModal'}
      />
      {isFiltering ? (
        <View style={styles.headingRow}>
          <HoliText bold style={{ color: colors.foreground20 }}>
            {filterSubtitle}
          </HoliText>
        </View>
      ) : (
        <>
          <HoliGap size="ml" />
          <HoliText size="large">{t(subtitle)}</HoliText>
        </>
      )}
    </View>
  )
}

// TODO(SF) use holi bricks
const styles = StyleSheet.create({
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
})
