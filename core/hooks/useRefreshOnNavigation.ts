import { useEffect } from 'react'

import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import { useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'

export type RefreshOnNavigationParams = {
  refresh?: string
}

export interface RefreshOnNavigationProps {
  initialized?: boolean
}

const { useParam, useUpdateParams } = createParamHooks<RefreshOnNavigationParams>()

const useRefreshOnNavigation = ({ initialized = false }: RefreshOnNavigationProps) => {
  const [refreshParam] = useParam('refresh')
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const {
    refreshControlProps: { onRefresh },
  } = useRefreshContext()

  useEffect(() => {
    if (initialized && refreshParam) {
      onRefresh?.()
      updateParams({ refresh: undefined })
    }
    // Only refresh if refreshParam was set to true after initializing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshParam])

  return null
}

export default useRefreshOnNavigation
