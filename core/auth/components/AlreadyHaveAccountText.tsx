import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { HoliTextLinkTracked } from '@holi/core/navigation/components/HoliTextLinkTracked'
import type { TrackingEvent } from '@holi/core/tracking'
import type { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import { Text } from 'holi-bricks/components/text'

export interface AlreadyHaveAccountTextProps {
  mobileNavigateBackFirst?: boolean
  align?: HoliTextLinkProps['align']
  trackingEvent: TrackingEvent
  onPress?(): void
}

const AlreadyHaveAccountText = ({
  mobileNavigateBackFirst = false,
  trackingEvent,
  onPress,
}: AlreadyHaveAccountTextProps) => {
  const { t } = useTranslation()

  return (
    <Text size="md" textAlign="center">
      <Trans t={t} i18nKey={'auth.registration.alreadyHasAccount'}>
        <HoliTextLinkTracked
          label={t('auth.login')}
          onPress={onPress ? onPress : undefined}
          href="/login"
          size="small"
          mobileNavigateBackFirst={mobileNavigateBackFirst}
          testID="btn-to-login-form"
          trackingEvent={trackingEvent}
        >
          {t('auth.login')}
        </HoliTextLinkTracked>
      </Trans>
    </Text>
  )
}

export default AlreadyHaveAccountText
