import { useEffect } from 'react'

import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'

export type RefreshOnNavigationParams = {
  refresh?: string
}

export interface RefreshOnNavigationProps {
  initialized?: boolean
  onRefresh?: () => Promise<unknown> | unknown
}

const { useParam, useUpdateParams } = createParamHooks<RefreshOnNavigationParams>()

const useRefreshOnNavigation = ({ initialized = false, onRefresh }: RefreshOnNavigationProps) => {
  const [refreshParam] = useParam('refresh')
  const updateParams = useUpdateParams(webReplaceQueryConfig)

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
