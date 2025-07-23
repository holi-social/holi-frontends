import React, { useCallback, useState } from 'react'
import { Linking, Platform } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { ExternalLink, FileCopy, Mail, Phone } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Stack } from 'holi-bricks/components/stack'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { ButtonIcon } from 'holi-bricks/components/button'
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
}

export const VolunteeringContact = ({ engagementId, document }: VolunteeringContactProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { show: showWebView, props: webViewModalProps } = useModalState()
  const { show: showContact, hide: hideContact, props: contactModalProps } = useModalState()
  const hasContactInfo = document.contact?.some(
    (contact) => contact.type !== 'website' || contact.value !== document.externalUrl
  )
  const [webViewUrl, setWebViewUrl] = useState(document.externalUrl)
  const { openToast } = useToast()
  const { styles } = useStyles(stylesheet)

  const openWebView = useCallback(
    async (url: string) => {
      hideContact()
      setWebViewUrl(url)
      // Without timeout app would freeze on iOS
      setTimeout(showWebView, 0)
    },
    [hideContact, showWebView]
  )

  const onGetInTouch = useCallback(() => {
    if (hasContactInfo) {
      return showContact()
    }
    if (document.externalUrl) {
      if (isWeb) {
        Linking.openURL(document.externalUrl)
      } else {
        openWebView(document.externalUrl)
      }
    }
  }, [document.externalUrl, hasContactInfo, openWebView, showContact])

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
                <ButtonIcon
                  icon={CONTACT_ICON[contact.type]}
                  label={t(`volunteering.engagementDetail.contactsDrawer.${contact.type}.cta`)}
                  onPress={() => onContactPress(contact)}
                  variant="secondary"
                />
              </Stack>
            ))}
          </Stack>
        </HoliContainer>
      </HoliModal>
      {webViewUrl && !isWeb && (
        <HoliModal
          label="modal"
          animationType="slide"
          style={{ width: '100%', height: '100%', flex: 1 }}
          shown={webViewModalProps.shown}
          onDismiss={webViewModalProps.onDismiss}
          testID="volunteering-external-url-modal"
        >
          <HoliWebView
            theme={theme}
            style={{ flex: 1, height: '100%', width: '100%' }}
            webViewProps={{ setSupportMultipleWindows: false, source: { uri: webViewUrl } }}
          />
        </HoliModal>
      )}
    </Stack>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.bg.main,
  },
}))
