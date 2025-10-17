import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TrackingEvent } from '@holi/core/tracking'
import { Spacing } from 'holi-bricks/foundations'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { Edit2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

interface CodeInputHeaderProps {
  email?: string
  onChangeEmail: () => void
  trackingScreenName: 'mainLogin' | 'mainRegistration'
}

export const CodeInputHeader = ({ email, onChangeEmail, trackingScreenName }: CodeInputHeaderProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.mailImage}>
      <Image
        source={require('@holi/ui/assets/img/illustrations/illustration_new_mail.svg')}
        width={251}
        height={181}
        alt={t('registration.emailVerification.heading')}
      />
      <Text size="3xl" textAlign="center">
        {t('registration.emailVerification.heading')}
      </Text>
      <Text textAlign="center">{t('registration.emailVerification.body')}</Text>
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
    </View>
  )
}

const stylesheet = createStyleSheet({
  mailImage: {
    marginTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  changeEmailContainer: {
    gap: Spacing['3xs'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
