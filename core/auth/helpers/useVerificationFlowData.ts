import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import type { ContinueWithVerificationUiFlow, UpdateLoginFlowBody } from '@ory/kratos-client'

export type VerificationFlowData = UpdateLoginFlowBody | ContinueWithVerificationUiFlow

export type VerificationFlowState = VerificationFlowData | 'verification-disabled' | undefined

export const verificationFlowDataVar = makeVar<VerificationFlowState>(undefined)

export const setVerificationFlowData = verificationFlowDataVar
export const clearVerificationFlowData = () => verificationFlowDataVar(undefined)

export const useVerificationFlowData = () => {
  return useReactiveVar(verificationFlowDataVar)
}
