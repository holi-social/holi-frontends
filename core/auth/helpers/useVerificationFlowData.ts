import { makeVar, useReactiveVar } from '@apollo/client'
import type { ContinueWithVerificationUiFlow, UpdateLoginFlowWithPasswordMethod } from '@ory/kratos-client'

export type VerificationFlowData = UpdateLoginFlowWithPasswordMethod | ContinueWithVerificationUiFlow

export type VerificationFlowState = VerificationFlowData | 'verification-disabled' | undefined

export const verificationFlowDataVar = makeVar<VerificationFlowState>(undefined)

export const setVerificationFlowData = verificationFlowDataVar
export const clearVerificationFlowData = () => verificationFlowDataVar(undefined)

export const useVerificationFlowData = () => {
  return useReactiveVar(verificationFlowDataVar)
}
