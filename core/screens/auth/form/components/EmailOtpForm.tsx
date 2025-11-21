import { AuthFormInputField } from '@holi/core/screens/auth/form/components/AuthFormInputField'
import { Mail } from '@holi/icons/src/generated'
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
  onSubmit: (step: 'email') => Promise<void>
  submitDisabled?: boolean
}

export const EmailOtpForm = ({
  email,
  setEmail,
  emailValidationError,
  autoFocusEmail,
  submitLabel,
  onSubmit,
  submitDisabled = false,
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
        onSubmit={() => onSubmit('email')}
        autoFocus={autoFocusEmail}
      />
      <Button
        margin={{ top: '3xs' }}
        label={submitLabel}
        onPress={() => onSubmit('email')}
        size="lg"
        disabled={submitDisabled}
        icon={Mail}
      />
    </Stack>
  )
}
