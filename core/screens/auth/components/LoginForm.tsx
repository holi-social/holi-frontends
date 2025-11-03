import type { LoginFlow } from '@ory/kratos-client'
import type React from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackingEvent } from '@holi/core/tracking'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { Key2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import type { AuthenticationStep } from '@holi/core/screens/auth/helpers/authenticationStep'
import { useOtpLoginForm } from '@holi/core/screens/auth/form/hooks/useOtpLoginForm'
import { EmailOtpForm } from '@holi/core/screens/auth/form/components/EmailOtpForm'
import { CodeOtpForm } from '@holi/core/screens/auth/form/components/CodeOtpForm'
import { EmailPasswordForm } from '@holi/core/screens/auth/form/components/EmailPasswordForm'
import { usePasswordLoginForm } from '@holi/core/screens/auth/form/hooks/usePasswordLoginForm'
import { useSocialLoginForm } from '@holi/core/screens/auth/form/hooks/useSocialLoginForm'
import { SocialLoginForm } from '@holi/core/screens/auth/form/components/SocialLoginForm'
import { useLoginFlow } from '@holi/core/screens/auth/form/hooks/useLoginFlow'
import { determineAuthenticationStepFromFlow } from '@holi/core/screens/auth/form/helpers/determineAuthenticationStepFromFlow'
import { Stack } from 'holi-bricks/components/stack'

interface LoginFormProps {
  startedFlowId?: string
  resetFlowId: () => void
  step: AuthenticationStep
  setStep: React.Dispatch<React.SetStateAction<AuthenticationStep>>
}

export const LoginForm = ({ startedFlowId, resetFlowId, step, setStep }: LoginFormProps) => {
  const { t } = useTranslation()

  const synchronizeStep = useCallback(
    (flow?: LoginFlow) => {
      const targetStep = determineAuthenticationStepFromFlow(flow, step)
      if (targetStep !== step) {
        setStep(targetStep)
      }
    },
    [step, setStep]
  )

  const { flow, performLogin, resetFlow } = useLoginFlow({ startedFlowId, onFlowUpdate: synchronizeStep, resetFlowId })

  const socialLoginFormProps = useSocialLoginForm({ flow, performLogin })
  const otpFormProps = useOtpLoginForm({ flow, performLogin, resetFlow })
  const passwordFormProps = usePasswordLoginForm({ flow, performLogin })

  return (
    <Stack margin={{ top: 'md' }} gap="md">
      {step === 'code' && <CodeOtpForm {...otpFormProps} />}
      {['start', 'email-password'].includes(step) && (
        <>
          <SocialLoginForm {...socialLoginFormProps} />

          <Stack gap="xs" direction="row" alignItems="center" justifyContent="center">
            <HoliDivider autoWidth />
            <Stack flex={1}>
              <Text textAlign="center" color="greyDark" flexShrink={0}>
                {t('auth.divider.email')}
              </Text>
            </Stack>

            <HoliDivider autoWidth />
          </Stack>

          {step === 'start' && (
            <Stack gap="3xs">
              <EmailOtpForm {...otpFormProps} />

              <ButtonTracked
                label={t('auth.CTA.emailPassword')}
                testID="btn-to-email-password-form"
                variant="secondary"
                size="lg"
                onPress={() => setStep('email-password')}
                icon={Key2}
                trackingEvent={TrackingEvent.Auth.HoliLoginPressed({
                  method: 'email',
                  screen: 'mainLogin',
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
