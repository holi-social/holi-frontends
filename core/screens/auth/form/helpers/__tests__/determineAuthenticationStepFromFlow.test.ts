import { determineAuthenticationStepFromFlow } from '@holi/core/screens/auth/form/helpers/determineAuthenticationStepFromFlow'
import type { LoginFlow } from '@ory/kratos-client'

const defaultFlow: LoginFlow = {
  expires_at: '2025-11-05T12:57:01.74283238Z',
  id: 'a571f1be-1821-4c4c-a99d-8cdb4e83cc7a',
  issued_at: '2025-11-05T12:27:01.74283238Z',
  request_url: '/api/.ory/self-service/login/browser?refresh=true',
  state: 'choose_method',
  type: 'browser',
  ui: {
    action: '/api/.ory/self-service/login?flow=a571f1be-1821-4c4c-a99d-8cdb4e83cc7a',
    method: 'POST',
    nodes: [],
  },
}

describe('determineAuthenticationStepFromFlow', () => {
  it('should return code if OTP e-mail was sent', () => {
    const step = determineAuthenticationStepFromFlow({ ...defaultFlow, active: 'code', state: 'sent_email' }, 'start')

    expect(step).toEqual('code')
  })

  it('should return email-password if active method is password', () => {
    const step = determineAuthenticationStepFromFlow({ ...defaultFlow, active: 'password' }, 'start')

    expect(step).toEqual('email-password')
  })

  it('should return email-password if previous step was email-password and no method is active yet', () => {
    const step = determineAuthenticationStepFromFlow(defaultFlow, 'email-password')

    expect(step).toEqual('email-password')
  })

  it('should return start if no method is active and previous step was not email-password', () => {
    const step = determineAuthenticationStepFromFlow(defaultFlow, 'code')

    expect(step).toEqual('start')
  })

  it('should return start if flow is missing and previous step was not email-password', () => {
    const step = determineAuthenticationStepFromFlow(undefined, 'code')

    expect(step).toEqual('start')
  })
})
