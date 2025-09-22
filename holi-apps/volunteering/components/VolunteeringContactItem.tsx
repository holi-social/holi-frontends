import React, { useCallback } from 'react'
import { Linking, Platform } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'

import { ButtonIconTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import { FileCopy, Mail, Phone, ExternalLink } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import type { Typesense_DocumentContact, Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useOpenLink } from '@holi/ui/helper/useOpenLink'

const isWeb = Platform.OS === 'web'

const CONTACT_ICON: { [key in Typesense_DocumentContactType]: HoliIconType } = {
  person: FileCopy,
  email: Mail,
  phone: Phone,
  website: ExternalLink,
}

interface VolunteeringContactItemProps {
  contact: Typesense_DocumentContact
  trackingEvent: TrackingEvent
  onWebViewOpen?: () => void
}

export const VolunteeringContactItem = ({ contact, trackingEvent, onWebViewOpen }: VolunteeringContactItemProps) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const onOpenLink = useOpenLink()

  const onContactPress = useCallback(
    (contact: Typesense_DocumentContact) => {
      const copyValue = () => {
        Clipboard.setString(contact.value)
        openToast(t('global.clipboard.copied'), HoliToastType.SUCCESS)
      }

      switch (contact.type) {
        case 'website': {
          onWebViewOpen?.()
          // Without timeout app would freeze on iOS
          setTimeout(() => onOpenLink(contact.value), 0)
          return
        }
        case 'email':
          return isWeb ? copyValue() : Linking.openURL(`mailto:${contact.value}`)
        case 'phone':
          return isWeb ? copyValue() : Linking.openURL(`tel:${contact.value}`)
        default:
          return copyValue()
      }
    },
    [openToast, onOpenLink, onWebViewOpen, t]
  )

  return (
    <Stack
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
        <Text>{contact.value}</Text>
      </Stack>

      <ButtonIconTracked
        icon={CONTACT_ICON[contact.type]}
        label={t(`volunteering.engagementDetail.contactsDrawer.${contact.type}.cta`)}
        onPress={() => onContactPress(contact)}
        variant="secondary"
        trackingEvent={trackingEvent}
      />
    </Stack>
  )
}
