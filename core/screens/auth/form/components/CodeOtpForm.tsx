import { ChangeEmailButton } from '@holi/core/screens/auth/components/ChangeEmailButton'
import { AuthFormInputField } from '@holi/core/screens/auth/form/components/AuthFormInputField'
import { Refresh } from '@holi/icons/src/generated'
import { Button } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface CodeOtpFormProps {
  email?: string
  onChangeEmail: () => void
  code?: string
  setCode: (code?: string) => void
  codeValidationError?: string
  submitLabel: string
  onSubmit: () => Promise<void>
  submitDisabled: boolean
  onResend: () => Promise<void>
}

export const CodeOtpForm = ({
  email,
  onChangeEmail,
  code,
  setCode,
  codeValidationError,
  onSubmit,
  submitDisabled,
  onResend,
}: CodeOtpFormProps) => {
  const { t } = useTranslation()

  return (
    <Stack gap="3xs">
      <ChangeEmailButton email={email} onChangeEmail={onChangeEmail} trackingScreenName="mainLogin" />
      <AuthFormInputField
        label={t('auth.login.input.label-SignInCode')}
        placeholder={t('auth.login.input.label-SignInCode')}
        value={code}
        validationErrorText={codeValidationError}
        onChange={setCode}
        type="text"
        onSubmit={onSubmit}
      />
      <Button
        margin={{ top: '3xs' }}
        label={t('auth.login.cta.verifyEmail')}
        onPress={onSubmit}
        size="lg"
        disabled={submitDisabled}
      />
      <Stack gap="3xs" direction="row" alignItems="center" justifyContent="center">
        <Text>{t('registration.emailVerification.resendInstruction')}</Text>
        <Button
          label={t('registration.emailVerification.resendEmail')}
          onPress={onResend}
          size="lg"
          transparent
          icon={Refresh}
        />
      </Stack>
    </Stack>
  )
}
