import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

const unauthorizedErrorStatusVar = makeVar<boolean>(false)
export const setUnauthorizedErrorStatus = unauthorizedErrorStatusVar
export const useUnauthorizedErrorStatusVar = () => useReactiveVar(unauthorizedErrorStatusVar)
