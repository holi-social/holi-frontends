import type { LoginFlow } from '@ory/kratos-client'
import type React from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TrackingEvent } from '@holi/core/tracking'
import { Spacing } from 'holi-bricks/foundations'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { Key2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
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

interface LoginFormProps {
  startedFlowId?: string
  resetFlowId: () => void
  step: AuthenticationStep
  setStep: React.Dispatch<React.SetStateAction<AuthenticationStep>>
}

export const LoginForm = ({ startedFlowId, resetFlowId, step, setStep }: LoginFormProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

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
    // TODO(SF) form style
    <View>
      {step === 'code' && <CodeOtpForm {...otpFormProps} />}
      {['start', 'email-password'].includes(step) && (
        <>
          <SocialLoginForm {...socialLoginFormProps} />

          <View style={styles.dividerContainer}>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
            <View style={styles.dividerContainer}>
              <Text textAlign="center" color="greyDark">
                {t('auth.divider.email')}
              </Text>
            </View>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
          </View>
          {step === 'start' && (
            <>
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
            </>
          )}
        </>
      )}
      {step === 'email-password' && <EmailPasswordForm {...passwordFormProps} />}
    </View>
  )
}

const stylesheet = createStyleSheet({
  form: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  formItemContainer: {
    marginTop: Spacing.sm,
  },
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
  dividerContainer: {
    marginTop: Spacing['3xs'],
    marginBottom: Spacing['3xs'],
    gap: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  divider: {
    flex: 1,
  },
})
