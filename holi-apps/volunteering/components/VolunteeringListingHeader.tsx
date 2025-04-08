import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import InfoModal from '@holi/core/components/InfoModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'

interface VolunteeringListingHeaderProps {
  isFiltering?: boolean
  filterSubtitle: string
}
export const VolunteeringListingHeader = ({ isFiltering, filterSubtitle }: VolunteeringListingHeaderProps) => {
  const { t } = useTranslation()
  const subtitle = useRecosSubtitle()
  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()
  const { styles } = useStyles(stylesheet)

  return (
    <View>
      <Text size="3xl">{t('volunteering:discoveryV1.headline')}</Text>
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
          <Text size="md" color="support">
            {filterSubtitle}
          </Text>
        </View>
      ) : (
        <>
          <HoliGap size="ml" />
          <Text size="xxl">{t(subtitle)}</Text>
        </>
      )}
    </View>
  )
}

const stylesheet = createStyleSheet({
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
})
