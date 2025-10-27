import { type AuthenticationStep, getFormNodesByStep } from '@holi/core/screens/auth/helpers/authenticationStep'

describe('getFormNodesByStep', () => {
  const testCases = [
    { step: 'oidc', expectedNodes: ['oidc'] },
    { step: 'email-password', expectedNodes: ['email', 'password'] },
    { step: 'email-code', expectedNodes: ['email', 'code'] },
    { step: 'code', expectedNodes: ['code'] },
    { step: 'invalid', expectedNodes: [] },
  ]

  it.each(testCases)('should return correct form node types for step $step', ({ step, expectedNodes }) => {
    const actualNodes = getFormNodesByStep(step as AuthenticationStep)

    expect(actualNodes).toEqual(expectedNodes)
  })
})
