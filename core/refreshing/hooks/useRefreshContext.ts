import { createContext, useContext } from 'react'
import { RefreshControlProps } from 'react-native'

export type RefreshHandler = () => Promise<unknown> | unknown

export interface RefreshContextType {
  refreshControlProps: RefreshControlProps
  registerRefreshHandler?: (handler: RefreshHandler) => () => void
}

export const RefreshContext = createContext<RefreshContextType | null>(null)

export const useRefreshContext = () => {
  const context = useContext(RefreshContext)

  return {
    refreshControlProps: context?.refreshControlProps || {
      refreshing: false,
      onRefresh: undefined,
    },
    registerRefreshHandler: context?.registerRefreshHandler,
  }
}
