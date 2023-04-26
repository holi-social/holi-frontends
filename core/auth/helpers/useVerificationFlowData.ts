import { makeVar, useReactiveVar } from '@apollo/client'

export interface VerificationFlowData {
  id?: string
  email?: string
}

const verificationFlowDataVar = makeVar<VerificationFlowData | undefined>(undefined)

export const setVerificationFlowData = verificationFlowDataVar

export const useVerificationFlowData = () => {
  return useReactiveVar(verificationFlowDataVar)
}
