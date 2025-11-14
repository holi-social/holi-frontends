import React from 'react'
import { SocialLoginButton, type SocialLoginButtonProvider } from 'holi-bricks/components/button/SocialLoginButton'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'

export type SocialLoginFormProps = {
  onSubmit: (provider: SocialLoginButtonProvider) => Promise<void>
}

export const SocialLoginForm = ({ onSubmit }: SocialLoginFormProps) => {
  const { t } = useTranslation()

  return (
    <Stack gap="3xs">
      {Platform.OS !== 'android' && (
        <SocialLoginButton
          provider="Apple"
          label={t('auth.login.input.label-ProviderSignIn', { provider: 'Apple' })}
          onPress={() => onSubmit('Apple')}
        />
      )}
      <SocialLoginButton
        provider="Google"
        label={t('auth.login.input.label-ProviderSignIn', { provider: 'Google' })}
        onPress={() => onSubmit('Google')}
      />
    </Stack>
  )
}
