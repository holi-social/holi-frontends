import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { HoliTextLinkTracked } from '@holi/core/navigation/components/HoliTextLinkTracked'
import { TrackingEvent } from '@holi/core/tracking'
import HoliText from '@holi/ui/components/atoms/HoliText'

export interface AlreadyHaveAccountTextProps {
  mobileNavigateBackFirst?: boolean
  style?: StyleProp<ViewStyle>
  trackingEvent: TrackingEvent
  onPress?(): void
}

const AlreadyHaveAccountText = ({
  mobileNavigateBackFirst = false,
  style,
  trackingEvent,
  onPress,
}: AlreadyHaveAccountTextProps) => {
  const { t } = useTranslation()

  return (
    <HoliText size="small" style={style} testID="already-have-account-text">
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
    </HoliText>
  )
}

export default AlreadyHaveAccountText
