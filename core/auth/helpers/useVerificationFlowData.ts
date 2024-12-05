import { makeVar, useReactiveVar } from '@apollo/client'
import type { ContinueWithVerificationUiFlow, UpdateLoginFlowWithPasswordMethod } from '@ory/kratos-client'

export type VerificationFlowData = UpdateLoginFlowWithPasswordMethod | ContinueWithVerificationUiFlow

export const verificationFlowDataVar = makeVar<VerificationFlowData | 'verification-disabled' | undefined>(undefined)

export const setVerificationFlowData = verificationFlowDataVar
export const clearVerificationFlowData = () => verificationFlowDataVar(undefined)

export const useVerificationFlowData = () => {
  return useReactiveVar(verificationFlowDataVar)
}
