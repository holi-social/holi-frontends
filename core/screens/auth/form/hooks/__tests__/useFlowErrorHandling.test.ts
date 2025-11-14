import { type AxiosResponse, AxiosError } from 'axios'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  flowHasDuplicatedAccountError,
  useFlowErrorHandling,
} from '@holi/core/screens/auth/form/hooks/useFlowErrorHandling'
import type { UiText } from '@ory/kratos-client'
import { renderHook } from '@testing-library/react-native'
import {
  createFlowWithMessage,
  createFlowWithMessages,
  loginFlow,
} from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { OryErrorCode } from '@holi/core/auth/helpers/auth/errorCodes'
import { useTranslation, type UseTranslationResponse } from 'react-i18next'

const mockUseTranslation = jest.mocked(useTranslation)
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const errorCodesDuplicatedAccount = [
  OryErrorCode.ACCOUNT_ALREADY_EXISTS,
  OryErrorCode.DUPLICATED_ACCOUNT_IDENTIFIER,
  OryErrorCode.INVALID_REGISTRATION_STRATEGY,
]

describe('useFlowErrorHandling', () => {
  const setupErrorHandling = () => {
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    const { result } = renderHook(() => useFlowErrorHandling())
    const callbacks = {
      resetFlow: jest.fn(),
      handleBrowserLogin: jest.fn().mockResolvedValue(undefined),
      handleEmailVerification: jest.fn(),
      updateFlow: jest.fn(),
    }

    return { handleFlowSubmitError: result.current.handleFlowSubmitError, callbacks, displayError }
  }

  beforeEach(() => {
    const i18nMock = {
      exists: () => true,
      t: (key: string) => key,
    }
    mockUseTranslation.mockReturnValue({
      i18n: i18nMock,
    } as unknown as UseTranslationResponse<'test', ''>)
  })

  describe('CANCELLED_FLOW', () => {
    it('should recognize and ignore user-initiated cancel events', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()

      handleFlowSubmitError(new HoliLoginCancelledError('Test'), callbacks)

      expect(displayError).not.toHaveBeenCalled()
      expect(callbacks.handleBrowserLogin).not.toHaveBeenCalled()
      expect(callbacks.handleEmailVerification).not.toHaveBeenCalled()
      expect(callbacks.resetFlow).not.toHaveBeenCalled()
      expect(callbacks.updateFlow).not.toHaveBeenCalled()
    })
  })

  describe('INVALID_FLOW', () => {
    it('should display error and reset flow if flow could not be found', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const response = { status: 404 } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Flow not found', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.resetFlow).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(response, 'Flow is invalid, reinitializing flow', {
        location: 'useFlowErrorHandling.handleFlowSubmitError',
        logLocally: true,
      })
    })

    it('should display error and reset flow if flow is expired', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const response = { status: 410 } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Flow expired', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.resetFlow).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(response, 'Flow is invalid, reinitializing flow', {
        location: 'useFlowErrorHandling.handleFlowSubmitError',
        logLocally: true,
      })
    })
  })

  describe('BROWSER_REDIRECT', () => {
    it('should extract url and handle browser redirect', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const response = {
        status: 422,
        data: {
          error: {
            id: 'browser_location_change_required',
          },
          redirect_browser_to: 'some url',
        },
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Browser redirect', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.handleBrowserLogin).toHaveBeenCalledWith('some url')
      expect(displayError).not.toHaveBeenCalled()
    })

    it('should handle errors during browser redirect', async () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const redirectError = new Error('Test')
      callbacks.handleBrowserLogin.mockRejectedValue(redirectError)
      const response = {
        status: 422,
        data: {
          error: {
            id: 'browser_location_change_required',
          },
          redirect_browser_to: 'some url',
        },
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Browser redirect', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.handleBrowserLogin).toHaveBeenCalledWith('some url')

      await jest.runAllTimersAsync()

      // Expect handling of generic error
      expect(callbacks.resetFlow).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(redirectError, 'Failed to submit flow', {
        location: 'useFlowErrorHandling.handleFlowSubmitError',
      })
    })
  })

  describe('DUPLICATED_ACCOUNT', () => {
    it.each(errorCodesDuplicatedAccount)('should handle %s', (code) => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const response = {
        status: 400,
        data: createFlowWithMessage(loginFlow, {
          type: 'info',
          text: 'Duplicated account',
          id: code,
        }),
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Duplicated account', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.resetFlow).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(new Error('Email already used'), 'Failed to submit flow', {
        displayMessage: 'auth.login.message.1010016',
        location: 'useFlowErrorHandling.handleFlowSubmitError',
        logLocally: true,
      })
    })
  })

  describe('ACCOUNT_NOT_VERIFIED', () => {
    it('should handle unverified accounts', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const response = {
        status: 400,
        data: createFlowWithMessage(loginFlow, {
          type: 'error',
          text: 'Account not verified',
          id: OryErrorCode.ACCOUNT_NOT_VERIFIED,
        }),
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Unverified account', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.handleEmailVerification).toHaveBeenCalled()
      expect(displayError).not.toHaveBeenCalled()
    })
  })

  describe('BAD_REQUEST', () => {
    it('should handle bad request', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const messageToShow: UiText = {
        type: 'error',
        text: 'Property missing',
        id: OryErrorCode.PROPERTY_MISSING,
      }
      const flow = createFlowWithMessage(loginFlow, messageToShow)
      const response = {
        status: 400,
        data: flow,
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Bad request', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.updateFlow).toHaveBeenCalledWith(flow)
      expect(displayError).toHaveBeenCalledWith(messageToShow, 'Bad request when submitting flow', {
        displayMessage: 'auth.login.message.4000002',
        testID: 'message-4000002',
        location: 'useFlowErrorHandling.handleFlowSubmitError',
        logLocally: true,
      })
    })

    it('should only display one message', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const messageToShow: UiText = {
        type: 'error',
        text: 'Property missing',
        id: OryErrorCode.PROPERTY_MISSING,
      }
      const flow = createFlowWithMessages(loginFlow, [
        messageToShow,
        {
          type: 'error',
          text: 'Property error',
          id: OryErrorCode.PROPERTY_ERROR,
        },
      ])
      const response = {
        status: 400,
        data: flow,
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Bad request', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.updateFlow).toHaveBeenCalledWith(flow)
      expect(displayError).toHaveBeenCalledTimes(1)
      expect(displayError).toHaveBeenCalledWith(messageToShow, 'Bad request when submitting flow', {
        displayMessage: 'auth.login.message.4000002',
        testID: 'message-4000002',
        location: 'useFlowErrorHandling.handleFlowSubmitError',
        logLocally: true,
      })
    })

    const codeSentCodes = [OryErrorCode.CODE_SENT_LOGIN, OryErrorCode.CODE_SENT_REGISTRATION]
    it.each(codeSentCodes)('should not display code sent message %s', (code) => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const messageToShow: UiText = {
        type: 'error', // Note: Normally these messages are of type info, this is just for making extra sure the message won't be shown
        text: 'Code sent',
        id: code,
      }
      const flow = createFlowWithMessage(loginFlow, messageToShow)
      const response = {
        status: 400,
        data: flow,
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Bad request', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.updateFlow).toHaveBeenCalledWith(flow)
      expect(displayError).not.toHaveBeenCalled()
    })

    it('should not display info messages', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const messageToShow: UiText = {
        type: 'info',
        text: 'Some info',
        id: 123,
      }
      const flow = createFlowWithMessage(loginFlow, messageToShow)
      const response = {
        status: 400,
        data: flow,
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Bad request', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.updateFlow).toHaveBeenCalledWith(flow)
      expect(displayError).not.toHaveBeenCalled()
    })

    it('should not display success messages', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const messageToShow: UiText = {
        type: 'success',
        text: 'Some success messages',
        id: 123,
      }
      const flow = createFlowWithMessage(loginFlow, messageToShow)
      const response = {
        status: 400,
        data: flow,
      } as AxiosResponse

      handleFlowSubmitError(new AxiosError('Bad request', undefined, undefined, undefined, response), callbacks)

      expect(callbacks.updateFlow).toHaveBeenCalledWith(flow)
      expect(displayError).not.toHaveBeenCalled()
    })
  })

  describe('GENERIC', () => {
    it('should handle generic axios error', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const response = {
        status: 400,
        data: {
          error: {
            code: 500,
          },
        },
      } as AxiosResponse
      const error = new AxiosError('Generic error', undefined, undefined, undefined, response)

      handleFlowSubmitError(error, callbacks)

      expect(callbacks.resetFlow).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(error, 'Failed to submit flow', {
        location: 'useFlowErrorHandling.handleFlowSubmitError',
      })
    })

    it('should handle generic errors', () => {
      const { handleFlowSubmitError, callbacks, displayError } = setupErrorHandling()
      const error = new Error('Test')

      handleFlowSubmitError(error, callbacks)

      expect(callbacks.resetFlow).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(error, 'Failed to submit flow', {
        location: 'useFlowErrorHandling.handleFlowSubmitError',
      })
    })
  })
})

describe('flowHasDuplicatedAccountError', () => {
  it.each(errorCodesDuplicatedAccount)('should recognize flow with code %s', (code) => {
    const flow = createFlowWithMessage(loginFlow, {
      type: 'info',
      text: 'Duplicated account',
      id: code,
    })

    expect(flowHasDuplicatedAccountError(flow)).toBeTruthy()
  })

  it('should recognize flow without duplicated account code', () => {
    expect(flowHasDuplicatedAccountError(loginFlow)).toBeFalsy()
  })
})
