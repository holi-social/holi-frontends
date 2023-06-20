import { makeVar, useReactiveVar } from '@apollo/client'

const pathname = makeVar('/')
export const setPathname = pathname
export const usePathname = () => useReactiveVar(pathname)
