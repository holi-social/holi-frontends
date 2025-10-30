import type { AuthenticationStep } from '@holi/core/screens/auth/helpers/authenticationStep'
import { type LoginFlow, LoginFlowActiveEnum, LoginFlowState, type RegistrationFlow } from '@ory/kratos-client'

export const determineAuthenticationStepFromFlow = (
  flow: LoginFlow | RegistrationFlow | undefined,
  currentStep: AuthenticationStep
): AuthenticationStep => {
  if (flow?.active === LoginFlowActiveEnum.Code && flow?.state === LoginFlowState.SentEmail) {
    return 'code'
  } else if (flow?.active === LoginFlowActiveEnum.Password) {
    return 'email-password'
  }
  if (!flow?.active) {
    return currentStep
  }
  return 'start'
}
