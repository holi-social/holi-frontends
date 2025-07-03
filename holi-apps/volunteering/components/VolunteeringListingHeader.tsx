import React from 'react'
import { useTranslation } from 'react-i18next'
import { PartnerListInfoRow } from '@holi-apps/volunteering/components/PartnerListInfoRow'
import InfoModal from '@holi/core/components/InfoModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { Text } from 'holi-bricks/components/text'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Stack } from 'holi-bricks/components/stack'

export const VolunteeringListingHeader = () => {
  const { t } = useTranslation()
  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()

  return (
    <HoliContainer>
      <Stack gap="3xs" margin={{ bottom: '3xs' }}>
        <Text size="3xl" margin={{ top: 'md' }}>
          {t('volunteering.discoveryV1.headline')}
        </Text>
        <PartnerListInfoRow
          rowText={t('volunteering.listing.subline')}
          linkLabel={t('volunteering.partners.label')}
          partners={allPartners}
          onPress={showPartnerModal}
        />
      </Stack>
      <InfoModal
        headline={t('volunteering.listing.partnerModal.headline')}
        items={allPartners}
        shown={partnerModalVisible}
        onDismiss={closeModal}
        testID={'volunteering-partner-modal'}
        i18nPrefix={'volunteering.listing.partnerModal'}
      />
    </HoliContainer>
  )
}
