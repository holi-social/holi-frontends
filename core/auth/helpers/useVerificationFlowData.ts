import { makeVar, useReactiveVar } from '@apollo/client'
import { UpdateLoginFlowWithPasswordMethod } from '@ory/kratos-client'

export type VerificationFlowData = UpdateLoginFlowWithPasswordMethod | { id: string; verifiable_address: string }

const verificationFlowDataVar = makeVar<VerificationFlowData | undefined>(undefined)

export const setVerificationFlowData = verificationFlowDataVar

export const useVerificationFlowData = () => {
  return useReactiveVar(verificationFlowDataVar)
}
