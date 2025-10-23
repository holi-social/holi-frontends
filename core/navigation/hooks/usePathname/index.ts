import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

const pathname = makeVar('/')
export const setPathname = pathname
export const usePathname = () => useReactiveVar(pathname)
