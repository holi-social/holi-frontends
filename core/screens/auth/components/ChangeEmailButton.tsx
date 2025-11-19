import React from 'react'
import { useTranslation } from 'react-i18next'

import { TrackingEvent } from '@holi/core/tracking'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { Edit2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'

interface ChangeEmailButtonProps {
  email?: string
  onChangeEmail: () => void
  trackingScreenName: 'mainLogin' | 'mainRegistration'
}

export const ChangeEmailButton = ({ email, onChangeEmail, trackingScreenName }: ChangeEmailButtonProps) => {
  const { t } = useTranslation()

  return (
    <Stack gap="3xs" direction="row" alignItems="center" justifyContent="center">
      <Text>{email}</Text>
      <ButtonTracked
        icon={Edit2}
        transparent
        size="lg"
        label={t('global.edit')}
        onPress={onChangeEmail}
        trackingEvent={TrackingEvent.Auth.OneTimeCodePressed({
          step: 'edit',
          screen: trackingScreenName,
        })}
      />
    </Stack>
  )
}
