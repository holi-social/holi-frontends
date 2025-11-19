import type { RegistrationFlow } from '@ory/kratos-client'
import type React from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'holi-bricks/components/text'
import { Key2 } from '@holi/icons/src/generated'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import type { AuthenticationStep } from '@holi/core/screens/auth/types'
import { determineAuthenticationStepFromFlow } from '@holi/core/screens/auth/form/helpers/determineAuthenticationStepFromFlow'
import { useRegistrationFlow } from '@holi/core/screens/auth/form/hooks/useRegistrationFlow'
import { Stack } from 'holi-bricks/components/stack'
import { CodeOtpForm } from '@holi/core/screens/auth/form/components/CodeOtpForm'
import { SocialLoginForm } from '@holi/core/screens/auth/form/components/SocialLoginForm'
import { EmailOtpForm } from '@holi/core/screens/auth/form/components/EmailOtpForm'
import { EmailPasswordForm } from '@holi/core/screens/auth/form/components/EmailPasswordForm'
import { useOtpRegistrationForm } from '@holi/core/screens/auth/form/hooks/useOtpRegistrationForm'
import { usePasswordRegistrationForm } from '@holi/core/screens/auth/form/hooks/usePasswordRegistrationForm'
import { useSocialRegistrationForm } from '@holi/core/screens/auth/form/hooks/useSocialRegistrationForm'

export interface RegistrationProps {
  onRegister?: () => void
  startedFlowId?: string
  resetFlowId: () => void
  step: AuthenticationStep
  setStep: React.Dispatch<React.SetStateAction<AuthenticationStep>>
}

export const RegistrationForm = ({ onRegister, startedFlowId, resetFlowId, step, setStep }: RegistrationProps) => {
  const { t } = useTranslation()

  const synchronizeStep = useCallback(
    (flow?: RegistrationFlow) => {
      const targetStep = determineAuthenticationStepFromFlow(flow, step)
      if (targetStep !== step) {
        setStep(targetStep)
      }
    },
    [step, setStep]
  )

  const { flow, performRegistration, resetFlow, usePasswordLabel } = useRegistrationFlow({
    startedFlowId,
    onFlowUpdate: synchronizeStep,
    resetFlowId,
    onRegister,
  })

  const socialLoginFormProps = useSocialRegistrationForm({ flow, performRegistration })
  const otpFormProps = useOtpRegistrationForm({ flow, performRegistration, resetFlow })
  const passwordFormProps = usePasswordRegistrationForm({ flow, performRegistration })

  return (
    <Stack margin={{ top: 'md' }} gap="md">
      {step === 'code' && <CodeOtpForm {...otpFormProps} />}
      {['start', 'email-password'].includes(step) && (
        <>
          <SocialLoginForm {...socialLoginFormProps} />

          <Stack gap="3xs" direction="row" alignItems="center" justifyContent="center">
            <HoliDivider autoWidth />
            <Stack wrap="nowrap">
              <Text textAlign="center" color="greyDark" size="xs">
                {t('auth.divider.email')}
              </Text>
            </Stack>

            <HoliDivider autoWidth />
          </Stack>

          {step === 'start' && (
            <Stack gap="3xs">
              <EmailOtpForm {...otpFormProps} />

              <ButtonTracked
                label={usePasswordLabel}
                testID="btn-to-email-password-form"
                variant="secondary"
                size="lg"
                onPress={() => {
                  passwordFormProps.setEmail(otpFormProps.email)
                  setStep('email-password')
                }}
                icon={Key2}
                trackingEvent={TrackingEvent.Auth.HoliLoginPressed({
                  method: 'email',
                  screen: 'mainRegistration',
                })}
              />
            </Stack>
          )}
        </>
      )}
      {step === 'email-password' && <EmailPasswordForm {...passwordFormProps} />}
    </Stack>
  )
}
