import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { ExternalLink } from '@holi/icons/src/generated'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ButtonIconTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'holi-bricks/components/text'

const isWeb = Platform.OS === 'web'

interface FieldWebsiteProps {
  externalUrl: string
  trackingEvent: TrackingEvent
}

export const FieldWebsite = ({ externalUrl, trackingEvent }: FieldWebsiteProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { show, props: modalProps } = useModalState()

  const openWebsite = () => {
    if (externalUrl) {
      if (isWeb) {
        Linking.openURL(externalUrl)
      } else {
        show()
      }
    }
  }

  return (
    <Stack
      borderColor="default"
      borderRadius="xs"
      borderStyle="solid"
      borderWidth="sm"
      padding="xxs"
      direction="row"
      justifyContent="space-between"
      gap="xs"
      backgroundColor="support"
    >
      <Stack gap="4xs" flexShrink={1}>
        <Text size="xs" color="support">
          {/* localazy */}
          Website
        </Text>
        <Text size="md">{externalUrl}</Text>
      </Stack>

      <ButtonIconTracked
        trackingEvent={trackingEvent}
        variant="secondary"
        icon={ExternalLink}
        label={t('volunteering.engagementDetail.getInTouch')}
        onPress={openWebsite}
        testID="volunteering-engagement-get-in-touch-btn"
      />

      {!isWeb && externalUrl && (
        <HoliModal
          label="modal"
          animationType="slide"
          style={{ width: '100%', height: '100%', flex: 1 }}
          shown={modalProps.shown}
          onDismiss={modalProps.onDismiss}
          testID={'volunteering-external-url-modal'}
        >
          <HoliWebView
            theme={theme}
            style={{ flex: 1, height: '100%', width: '100%' }}
            webViewProps={{ setSupportMultipleWindows: false, source: { uri: externalUrl } }}
          />
        </HoliModal>
      )}
    </Stack>
  )
}
