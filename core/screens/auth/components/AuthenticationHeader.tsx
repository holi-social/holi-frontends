import React from 'react'
import type { AuthenticationStep } from '@holi/core/screens/auth/helpers/authenticationStep'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'

interface AuthenticationHeaderProps {
  authenticationStep: AuthenticationStep
}

export const AuthenticationHeader = ({ authenticationStep }: AuthenticationHeaderProps) => {
  const { t } = useTranslation()

  if (authenticationStep === 'code') {
    return (
      <Stack justifyContent="center" gap="xs" alignItems="center" margin={{ top: 'md' }}>
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
      </Stack>
    )
  }

  return (
    <Text
      headingLevel="1"
      size="4xl"
      textAlign="center"
      margin={{
        bottom: 'xs',
      }}
    >
      {t('registration.signUp.heading')}
      <Image source={require('@holi/ui/assets/img/icons/give-five-filled.svg')} width={50} height={40} alt="" />
    </Text>
  )
}
