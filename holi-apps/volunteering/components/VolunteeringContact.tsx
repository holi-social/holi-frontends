import React, { useCallback } from 'react'
import { Linking, Platform } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { ButtonIconTracked, ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { ExternalLink, FileCopy, Mail, Phone } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import type { Typesense_DocumentContact, Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

const isWeb = Platform.OS === 'web'

const CONTACT_ICON: { [key in Typesense_DocumentContactType]: HoliIconType } = {
  person: FileCopy,
  email: Mail,
  phone: Phone,
  website: ExternalLink,
}

interface VolunteeringContactProps {
  document: VolunteeringDetailsScreenData
  engagementId: string
  onOpenLink: (url?: string) => void
}

export const VolunteeringContact = ({ engagementId, document, onOpenLink }: VolunteeringContactProps) => {
  const { t } = useTranslation()
  const { show: showContact, hide: hideContact, props: contactModalProps } = useModalState()
  const hasContactInfo = document.contact?.some(
    (contact) => contact.type !== 'website' || contact.value !== document.externalUrl
  )
  const { openToast } = useToast()
  const { styles } = useStyles(stylesheet)
  const contactInfoDisplayed = document.contact?.map((contact) => contact.type)

  const openWebView = useCallback(
    async (url: string) => {
      hideContact()
      // Without timeout app would freeze on iOS
      setTimeout(() => onOpenLink(url), 0)
    },
    [hideContact, onOpenLink]
  )

  const onGetInTouch = useCallback(() => {
    if (hasContactInfo) {
      return showContact()
    }
    onOpenLink(document.externalUrl)
  }, [document.externalUrl, hasContactInfo, onOpenLink, showContact])

  const onContactPress = useCallback(
    (contact: Typesense_DocumentContact) => {
      const copyValue = () => {
        Clipboard.setString(contact.value)
        openToast(t('global.clipboard.copied'), HoliToastType.SUCCESS)
      }
      switch (contact.type) {
        case 'website': {
          return isWeb ? Linking.openURL(contact.value) : openWebView(contact.value)
        }
        case 'email':
          return isWeb ? copyValue() : Linking.openURL(`mailto:${contact.value}`)
        case 'phone':
          return isWeb ? copyValue() : Linking.openURL(`tel:${contact.value}`)
        default: {
          return copyValue()
        }
      }
    },
    [openToast, openWebView, t]
  )

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
              <Stack
                key={index}
                padding="xs"
                gap="xs"
                direction="row"
                borderRadius="xs"
                borderWidth="sm"
                borderColor="default"
                backgroundColor="support"
                alignItems="center"
              >
                <Stack gap="4xs" flex={1}>
                  <Text size="xs" color="support">
                    {t(`volunteering.engagementDetail.contactsDrawer.${contact.type}`)}
                  </Text>
                  <Text size="md">{contact.value}</Text>
                </Stack>

                <ButtonIconTracked
                  icon={CONTACT_ICON[contact.type]}
                  label={t(`volunteering.engagementDetail.contactsDrawer.${contact.type}.cta`)}
                  onPress={() => onContactPress(contact)}
                  variant="secondary"
                  trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                    commitmentType: document.commitmentType,
                    source: document.source,
                    contact_info_displayed: contactInfoDisplayed,
                    contact_method_selected: contact.type,
                  })}
                />
              </Stack>
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
