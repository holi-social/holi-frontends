import React, { PropsWithChildren } from 'react'

import { RefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import { useRefreshControl } from '@holi/core/refreshing/hooks/useRefreshControl'

export const RefreshContextProvider = ({ children }: PropsWithChildren) => {
  const context = useRefreshControl()

  return <RefreshContext.Provider value={context}>{children}</RefreshContext.Provider>
}
