import { OryErrorCode } from '@holi/core/auth/helpers/auth/errorCodes'
import { isAxiosError } from '@holi/core/auth/helpers/form'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { getLogger } from '@holi/core/helpers/logging'
import type { LoginFlow, RegistrationFlow, UiText } from '@ory/kratos-client'
import { useCallback } from 'react'
import { useTranslation, type UseTranslationResponse } from 'react-i18next'

const logger = getLogger('Auth')

type FlowSubmitError<F> =
  | {
      errorType: 'CANCELLED_FLOW' | 'DUPLICATED_ACCOUNT' | 'ACCOUNT_NOT_VERIFIED'
    }
  | {
      errorType: 'GENERIC' | 'INVALID_FLOW'
      error: unknown
    }
  | {
      errorType: 'BAD_REQUEST'
      flow: F
    }
  | {
      errorType: 'BROWSER_REDIRECT'
      redirectUrl: string
    }

const flowHasMessage = <F extends LoginFlow | RegistrationFlow>(flow: F | undefined, messageIds: number[]) =>
  flow?.ui?.messages?.some((message) => messageIds.includes(message.id))

export const flowHasDuplicatedAccountError = <F extends LoginFlow | RegistrationFlow>(flow: F) =>
  flowHasMessage(flow, [
    OryErrorCode.ACCOUNT_ALREADY_EXISTS,
    OryErrorCode.DUPLICATED_ACCOUNT_IDENTIFIER,
    OryErrorCode.INVALID_REGISTRATION_STRATEGY,
  ])

const buildErrorMessage = (i18n: UseTranslationResponse<'translation', undefined>['i18n'], message: UiText) => {
  const messageKey = `auth.login.message.${message.id}`
  const fallbackErrorMessage = i18n.t('auth.login.message.default')
  const messageText = i18n.exists(messageKey) ? i18n.t(messageKey) : fallbackErrorMessage
  if (!i18n.exists(messageKey)) {
    logError(new Error('Auth message without translation'), 'auth flow message', {
      location: 'useFlowErrorHandling.buildErrorMessage',
      errorId: message.id,
      messageKey,
    })
  }
  return messageText
}

const mapFlowSubmitError = <F extends LoginFlow | RegistrationFlow>(error: unknown): FlowSubmitError<F> => {
  if (error instanceof HoliLoginCancelledError) {
    return { errorType: 'CANCELLED_FLOW' }
  }
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 400: {
        const responseData = error.response.data as { error?: { code?: number } }
        if (typeof responseData.error === 'object' && responseData.error?.code === 500) {
          return { errorType: 'GENERIC', error: error.response }
        }
        const flow = error.response.data as F
        if (flowHasDuplicatedAccountError(flow)) {
          return { errorType: 'DUPLICATED_ACCOUNT' }
        }
        if (flowHasMessage(flow, [OryErrorCode.ACCOUNT_NOT_VERIFIED])) {
          return { errorType: 'ACCOUNT_NOT_VERIFIED' }
        }
        return { errorType: 'BAD_REQUEST', flow }
      }
      case 404:
      case 410:
        // This happens when the flow is, for example, expired or was deleted.
        // We simply re-initialize the flow if that happens!
        return { errorType: 'INVALID_FLOW', error: error.response }
      case 422: {
        // Not an error but the way Ory handles browser redirects
        const responseData = error.response?.data as { error?: { id: string }; redirect_browser_to?: string }
        if (responseData?.error?.id === 'browser_location_change_required' && responseData?.redirect_browser_to) {
          return { errorType: 'BROWSER_REDIRECT', redirectUrl: responseData?.redirect_browser_to }
        }
      }
    }
  }
  return { errorType: 'GENERIC', error: error }
}

export interface HandleFlowErrorProps<F extends LoginFlow | RegistrationFlow> {
  resetFlow: () => void
  handleBrowserLogin: (redirectUrl: string) => Promise<void>
  handleEmailVerification: () => void
  updateFlow: (flow: F) => void
}

export const useFlowErrorHandling = <F extends LoginFlow | RegistrationFlow>() => {
  const { displayError } = useErrorHandling()
  const { i18n } = useTranslation()

  const handleFlowSubmitError = useCallback(
    (error: unknown, callbacks: HandleFlowErrorProps<F>) => {
      const flowSubmitError = mapFlowSubmitError<F>(error)
      logger.debug(
        'useFlowErrorHandling.handleFlowSubmitError',
        `mapped "${error}" to ${flowSubmitError.errorType} error`
      )
      switch (flowSubmitError.errorType) {
        case 'CANCELLED_FLOW':
          // Do not display error if user cancelled the login/registration
          break
        case 'INVALID_FLOW':
          callbacks.resetFlow()
          displayError(flowSubmitError.error, 'Flow could not be found, reinitializing flow', {
            location: 'useFlowErrorHandling.handleFlowSubmitError',
            logLocally: true,
          })
          break
        case 'BROWSER_REDIRECT':
          callbacks
            .handleBrowserLogin(flowSubmitError.redirectUrl)
            .catch((error) => handleFlowSubmitError(error, callbacks))
          break
        case 'DUPLICATED_ACCOUNT':
          displayError(new Error('Email already used'), 'Failed to submit form', {
            displayMessage: i18n.t('auth.login.message.1010016'),
            location: 'useFlowErrorHandling.handleFlowSubmitError',
            logLocally: true,
          })
          callbacks.resetFlow()
          break
        case 'ACCOUNT_NOT_VERIFIED':
          callbacks.handleEmailVerification()
          break
        case 'BAD_REQUEST': {
          // Ignore info and success messages, esp. for when a code was sent
          // as this is displayed on the screen instead
          const relevantMessages = flowSubmitError.flow.ui.messages?.filter(
            (message) =>
              message.type === 'error' &&
              ![OryErrorCode.CODE_SENT_LOGIN, OryErrorCode.CODE_SENT_REGISTRATION].includes(message.id)
          )
          // Only display one message to the user
          if (relevantMessages?.length) {
            const messageToShow = relevantMessages[0]
            const displayMessage = buildErrorMessage(i18n, messageToShow)
            displayError(messageToShow, 'Bad request when submitting flow', {
              displayMessage,
              testID: `message-${messageToShow.id}`,
              location: 'useFlowErrorHandling.handleFlowSubmitError',
              logLocally: true,
            })
          }
          callbacks.updateFlow(flowSubmitError.flow)
          break
        }
        case 'GENERIC':
          callbacks.resetFlow()
          displayError(error, 'Failed to submit flow', {
            location: 'useFlowErrorHandling.handleFlowSubmitError',
          })
          break
      }
    },
    [displayError, i18n]
  )

  return { handleFlowSubmitError }
}
