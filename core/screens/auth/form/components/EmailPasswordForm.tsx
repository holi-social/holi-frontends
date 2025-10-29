import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import { AuthFormInputField } from '@holi/core/screens/auth/form/components/AuthFormInputField'
import { HoliTextLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'

export interface EmailPasswordFormProps {
  email?: string
  setEmail: (email?: string) => void
  emailValidationError?: string
  password?: string
  setPassword: (password?: string) => void
  passwordValidationError?: string
  autoFocusEmail?: boolean
  submitLabel: string
  onSubmit: () => Promise<void>
  submitDisabled: boolean
}

export const EmailPasswordForm = ({
  email,
  setEmail,
  emailValidationError,
  password,
  setPassword,
  passwordValidationError,
  autoFocusEmail,
  submitLabel,
  onSubmit,
  submitDisabled,
}: EmailPasswordFormProps) => {
  const { t } = useTranslation()

  return (
    <Stack gap="3xs">
      <AuthFormInputField
        label={t(`auth.login.input.label-Email`)}
        placeholder={t(`auth.login.input.placeholder-Email`)}
        value={email}
        validationErrorText={emailValidationError}
        onChange={setEmail}
        type="email"
        onSubmit={onSubmit}
        autoFocus={autoFocusEmail}
      />
      <AuthFormInputField
        label={t(`auth.login.input.label-Password`)}
        placeholder={t(`auth.login.input.placeholder-Password`)}
        value={password}
        validationErrorText={passwordValidationError}
        onChange={setPassword}
        type="password"
        onSubmit={onSubmit}
      />
      <Button margin={{ top: '3xs' }} label={submitLabel} onPress={onSubmit} size="lg" disabled={submitDisabled} />
      {/* TODO(SF) only for login */}
      <Stack margin={{ top: 'sm' }}>
        <HoliTextLinkTracked
          label={t('auth.login.link.forgotPassword')}
          href="/forgotPassword"
          size="sm"
          textAlign="center"
          trackingEvent={TrackingEvent.Auth.ForgotPasswordButtonPressed}
        >
          {t('auth.login.link.forgotPassword')}
        </HoliTextLinkTracked>
      </Stack>
    </Stack>
  )
}
