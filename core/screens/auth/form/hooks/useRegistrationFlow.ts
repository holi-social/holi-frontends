import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RegistrationFlow, SuccessfulNativeRegistration, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import { useSafeDispatch } from '@holi/core/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  flowHasDuplicatedAccountError,
  useFlowErrorHandling,
} from '@holi/core/screens/auth/form/hooks/useFlowErrorHandling'
import {
  doBrowserLogin,
  getRegistrationFlow,
  getVerificationFlowFromRegistration,
  initRegistrationFlow,
  submitRegistrationFlow,
} from '@holi/core/auth/helpers/auth'
import { Platform } from 'react-native'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { getLogger } from '@holi/core/helpers/logging'
import { useFinalizeRegistration } from '@holi/core/screens/auth/form/hooks/useFinalizeRegistration'
import type { TrackingEvent } from '@holi/core/tracking'

const logger = getLogger('Auth')

export interface UseRegistrationFlowProps {
  startedFlowId?: string
  resetFlowId: () => void
  onFlowUpdate: (flow?: RegistrationFlow) => void
  onRegister?: () => void
}

export const useRegistrationFlow = ({
  startedFlowId,
  resetFlowId,
  onFlowUpdate,
  onRegister,
}: UseRegistrationFlowProps) => {
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { handleFlowSubmitError } = useFlowErrorHandling<RegistrationFlow>()
  const finalizeRegistration = useFinalizeRegistration(onRegister)

  const initializeFlow = useCallback(
    ({ flowId }: { flowId?: string } = {}) => {
      const flowPromise = flowId
        ? getRegistrationFlow(flowId)
            .then((flow) => {
              // Treat message "E-mail address already used by another account" as error and recreate the registration flow (instead of linking the accounts by logging in with the existing credentials)
              if (flowHasDuplicatedAccountError(flow)) {
                displayError(new Error('Email already used'), 'Failed to initialize registration flow', {
                  displayMessage: t('auth.login.message.1010016'),
                  location: 'useRegistrationFlow.getRegistrationFlow',
                })
                resetFlowId()
                return initRegistrationFlow()
              }
              return flow
            })
            .catch((error) => {
              resetFlowId()
              throw error
            })
        : initRegistrationFlow()
      return flowPromise
        .then((flow) => {
          safeSetFlow(flow)
          onFlowUpdate(flow)
        })
        .catch((error) => {
          displayError(error, 'Failed to initialize registration flow', {
            displayMessage: t('auth.login.error.initialization'),
            location: 'useRegistrationFlow.initializeFlow',
          })
        })
    },
    [t, safeSetFlow, displayError, onFlowUpdate, resetFlowId]
  )

  useEffect(() => {
    if (!flow) {
      initializeFlow({ flowId: startedFlowId })
    }
  }, [initializeFlow, flow, startedFlowId])

  const performRegistration = useCallback(
    async (payload: UpdateRegistrationFlowBody, method: TrackingEvent.AuthMethod, provider?: string) => {
      if (!flow) {
        return
      }
      try {
        const { data }: { data: SuccessfulNativeRegistration } = await submitRegistrationFlow(flow, payload, provider)
        logger.debug('useRegistrationForm.performRegistration', 'registration was successful')

        const verificationFlowData = getVerificationFlowFromRegistration(data)
        logger.debug('useRegistrationForm.performRegistration', 'verification flow data', verificationFlowData)
        setVerificationFlowData(verificationFlowData)

        await finalizeRegistration(
          {
            session: data.session!,
            session_token: data.session_token,
          },
          method
        )
        logger.debug('useRegistrationForm.performRegistration', 'login after registration was successful')
      } catch (error) {
        handleFlowSubmitError(error, {
          resetFlow: initializeFlow,
          handleBrowserLogin: async (redirectUrl: string) => {
            if (Platform.OS === 'web') {
              navigate(redirectUrl)
            } else {
              const data = await doBrowserLogin(redirectUrl, flow)
              return finalizeRegistration(data, method)
            }
          },
          handleEmailVerification: () => {
            setVerificationFlowData(payload)
            storeOnboardingState('emailVerification')
          },
          updateFlow: (flow: RegistrationFlow) => {
            safeSetFlow(flow)
            onFlowUpdate(flow)
          },
        })
      }
    },
    [finalizeRegistration, flow, handleFlowSubmitError, initializeFlow, navigate, onFlowUpdate, safeSetFlow]
  )

  return {
    flow,
    performRegistration,
    resetFlow: () => initializeFlow(),
    usePasswordLabel: t('auth.CTA.registration.emailPassword'),
  }
}
