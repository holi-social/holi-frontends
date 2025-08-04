import React, { useCallback } from 'react'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { ExternalLink } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Stack } from 'holi-bricks/components/stack'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { VolunteeringContactItem } from '@holi-apps/volunteering/components/VolunteeringContactItem'

interface VolunteeringContactProps {
  document: VolunteeringDetailsScreenData
  engagementId: string
  onOpenLink: (url?: string) => void
  onModalDismiss: () => void
}

export const VolunteeringContact = ({
  engagementId,
  document,
  onOpenLink,
  onModalDismiss,
}: VolunteeringContactProps) => {
  const { t } = useTranslation()
  const {
    show: showContact,
    hide: hideContact,
    props: contactModalProps,
  } = useModalState({ onDismiss: onModalDismiss })
  const hasContactInfo = document.contact?.some(
    (contact) => contact.type !== 'website' || contact.value !== document.externalUrl
  )
  const { styles } = useStyles(stylesheet)
  const contactInfoDisplayed = document.contact?.map((contact) => contact.type)

  const onGetInTouch = useCallback(() => {
    if (hasContactInfo) {
      return showContact()
    }
    onOpenLink(document.externalUrl)
  }, [document.externalUrl, hasContactInfo, onOpenLink, showContact])

  return (
    <Stack
      padding={{ left: 'md', right: 'md', bottom: 'lg' }}
      alignItems="center"
      justifyContent="center"
      alignSelf="center"
      width="100%"
    >
      <ButtonTracked
        trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
          commitmentType: document.commitmentType,
          locationType: document.locationType,
          source: document.source,
          contact_info_displayed: contactInfoDisplayed,
        })}
        icon={hasContactInfo ? undefined : ExternalLink}
        label={
          hasContactInfo
            ? t('volunteering.engagementDetail.getInTouchDrawer')
            : t('volunteering.engagementDetail.getInTouch')
        }
        onPress={onGetInTouch}
        testID="volunteering-engagement-get-in-touch-btn"
      />

      <HoliModal
        label="modal"
        animationType="slide"
        shown={contactModalProps.shown}
        onDismiss={contactModalProps.onDismiss}
        autoHeight={true}
        testID="volunteering-contact-modal"
        backgroundColor={styles.modal.backgroundColor}
      >
        <HoliContainer>
          <Stack gap="4xs" margin={{ bottom: 'lg' }}>
            {document.contact?.map((contact, index) => (
              <VolunteeringContactItem
                key={contact.value + index}
                contact={contact}
                trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                  commitmentType: document.commitmentType,
                  source: document.source,
                  contact_info_displayed: contactInfoDisplayed,
                  contact_method_selected: contact.type,
                })}
                onWebViewOpen={hideContact}
              />
            ))}
          </Stack>
        </HoliContainer>
      </HoliModal>
    </Stack>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.bg.main,
  },
}))
