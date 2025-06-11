import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { HoliTextLinkTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'holi-bricks/components/text'
import { View } from 'react-native'
import { Link } from 'expo-router'

export interface AlreadyHaveAccountTextProps {
  trackingEvent: TrackingEvent
  onPress?(): void
}

const AlreadyHaveAccountText = ({ trackingEvent, onPress }: AlreadyHaveAccountTextProps) => {
  const { t } = useTranslation()

  return (
    <View testID="already-have-account-text">
      <Text size="sm" textAlign="center">
        <Trans t={t} i18nKey={'auth.registration.alreadyHasAccount'}>
          <Link asChild href={'/login'}>
            <HoliTextLinkTracked label={t('auth.login')} onPress={onPress} size="sm" trackingEvent={trackingEvent}>
              {t('auth.login')}
            </HoliTextLinkTracked>
          </Link>
        </Trans>
      </Text>
    </View>
  )
}

export default AlreadyHaveAccountText
