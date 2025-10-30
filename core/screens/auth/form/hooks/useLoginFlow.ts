import { useCallback, useEffect, useState } from 'react'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import { useSafeDispatch } from '@holi/core/helpers'
import { doBrowserLogin, getLoginFlow, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { useTranslation } from 'react-i18next'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { Platform } from 'react-native'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useFinalizeLogin } from '@holi/core/screens/auth/form/hooks/useFinalizeLogin'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  flowHasDuplicatedAccountError,
  useFlowErrorHandling,
} from '@holi/core/screens/auth/form/hooks/useFlowErrorHandling'

interface UseLoginFlowProps {
  startedFlowId?: string
  resetFlowId: () => void
  onFlowUpdate: (flow?: LoginFlow) => void
}

export const useLoginFlow = ({ startedFlowId, resetFlowId, onFlowUpdate }: UseLoginFlowProps) => {
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const finalizeLogin = useFinalizeLogin()
  const { navigate } = useRouting()
  const { handleFlowSubmitError } = useFlowErrorHandling<LoginFlow>()

  const initializeFlow = useCallback(
    (flowId?: string) => {
      const flowPromise = flowId
        ? getLoginFlow(flowId)
            .then((flow) => {
              // Treat message "E-mail address already used by another account" as error and recreate the login flow (instead of linking the accounts by logging in with the existing credentials)
              if (flowHasDuplicatedAccountError(flow)) {
                displayError(new Error('Email already used'), 'Failed to initialize login flow', {
                  displayMessage: t('auth.login.message.1010016'),
                  location: 'useLoginFlow.getLoginFlow',
                })
                resetFlowId()
                return initLoginFlow()
              }
              return flow
            })
            .catch((error) => {
              resetFlowId()
              throw error
            })
        : initLoginFlow()
      return flowPromise
        .then(safeSetFlow)
        .then(onFlowUpdate)
        .catch((error) => {
          displayError(error, 'Failed to initialize login flow', {
            displayMessage: t('auth.login.error.initialization'),
            location: 'useLoginFlow.initializeFlow',
          })
        })
    },
    [t, safeSetFlow, displayError, onFlowUpdate, resetFlowId]
  )

  useEffect(() => {
    if (!flow) {
      initializeFlow(startedFlowId)
    }
  }, [initializeFlow, flow, startedFlowId])

  const performLogin = async (payload: UpdateLoginFlowBody, provider?: string) => {
    if (!flow) return
    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, provider, undefined)
      await finalizeLogin(data)
    } catch (error) {
      handleFlowSubmitError(error, {
        resetFlow: initializeFlow,
        handleBrowserLogin: async (redirectUrl: string) => {
          if (Platform.OS === 'web') {
            navigate(redirectUrl)
          } else {
            const data = await doBrowserLogin(redirectUrl, flow)
            return finalizeLogin(data)
          }
        },
        handleEmailVerification: () => {
          setVerificationFlowData(payload)
          storeOnboardingState('emailVerification')
        },
        updateFlow: (flow: LoginFlow) => {
          safeSetFlow(flow)
          onFlowUpdate(flow)
        },
      })
    }
  }

  return { flow, performLogin, resetFlow: initializeFlow }
}
