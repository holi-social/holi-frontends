import { AuthFormInputField } from '@holi/core/screens/auth/form/components/AuthFormInputField'
import { Button } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface EmailOtpFormProps {
  email?: string
  setEmail: (email?: string) => void
  emailValidationError?: string
  autoFocusEmail?: boolean
  submitLabel: string
  onSubmit: () => Promise<void>
  submitDisabled: boolean
}

export const EmailOtpForm = ({
  email,
  setEmail,
  emailValidationError,
  autoFocusEmail,
  submitLabel,
  onSubmit,
  submitDisabled,
}: EmailOtpFormProps) => {
  const { t } = useTranslation()

  return (
    <Stack gap="3xs">
      <AuthFormInputField
        label={t('auth.login.input.label-Email')}
        placeholder={t('auth.login.input.placeholder-Email')}
        value={email}
        validationErrorText={emailValidationError}
        onChange={setEmail}
        type="email"
        onSubmit={onSubmit}
        autoFocus={autoFocusEmail}
      />
      <Button margin={{ top: '3xs' }} label={submitLabel} onPress={onSubmit} size="lg" disabled={submitDisabled} />
    </Stack>
  )
}
