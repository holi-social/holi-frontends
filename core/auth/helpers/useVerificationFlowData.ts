import { makeVar, useReactiveVar } from '@apollo/client'
import { ContinueWithVerificationUiFlow, UpdateLoginFlowWithPasswordMethod } from '@ory/kratos-client'

export type VerificationFlowData = UpdateLoginFlowWithPasswordMethod | ContinueWithVerificationUiFlow

const verificationFlowDataVar = makeVar<VerificationFlowData | 'verification-disabled' | undefined>(undefined)

export const setVerificationFlowData = verificationFlowDataVar

export const useVerificationFlowData = () => {
  return useReactiveVar(verificationFlowDataVar)
}
