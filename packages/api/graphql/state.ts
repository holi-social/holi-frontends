import { makeVar, useReactiveVar } from '@apollo/client'

const unauthorizedErrorStatusVar = makeVar<boolean>(false)
export const setUnauthorizedErrorStatus = unauthorizedErrorStatusVar
export const useUnauthorizedErrorStatusVar = () => useReactiveVar(unauthorizedErrorStatusVar)
