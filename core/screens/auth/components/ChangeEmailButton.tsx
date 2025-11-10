import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TrackingEvent } from '@holi/core/tracking'
import { Spacing } from 'holi-bricks/foundations'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { Edit2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

interface ChangeEmailButtonProps {
  email?: string
  onChangeEmail: () => void
  trackingScreenName: 'mainLogin' | 'mainRegistration'
}

export const ChangeEmailButton = ({ email, onChangeEmail, trackingScreenName }: ChangeEmailButtonProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.changeEmailContainer}>
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
    </View>
  )
}

const stylesheet = createStyleSheet({
  changeEmailContainer: {
    gap: Spacing['3xs'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
