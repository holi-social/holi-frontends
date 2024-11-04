import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, View, ViewStyle } from 'react-native'

import { HoliTextLinkTracked } from '@holi/core/navigation/components/HoliTextLinkTracked'
import { TrackingEvent } from '@holi/core/tracking'

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
    <View style={style}>
      <Text size="sm">
        <Trans t={t} i18nKey={'auth.registration.alreadyHasAccount'}>
          <HoliTextLinkTracked
            label={t('auth.login')}
            onPress={onPress ? onPress : undefined}
            href="/login"
            size="small"
            mobileNavigateBackFirst={mobileNavigateBackFirst}
            testID="btn-to-login-form"
            trackingEvent={trackingEvent}
          />
        </Trans>
      </Text>
    </View>
  )
}

export default AlreadyHaveAccountText
