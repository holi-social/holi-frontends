import { useEffect } from 'react'

import createParam from '@holi/core/navigation/hooks/useParam'

export type RefreshOnNavigationParams = {
  refresh?: string
}

export interface RefreshOnNavigationProps {
  initialized?: boolean
  onRefresh: () => Promise<void>
}

const { useParam } = createParam<RefreshOnNavigationParams>()

const useRefreshOnNavigation = ({ initialized = false, onRefresh }: RefreshOnNavigationProps) => {
  const [refreshParam, setRefreshParam] = useParam('refresh')

  useEffect(() => {
    if (initialized && refreshParam) {
      onRefresh()
      setRefreshParam(undefined)
    }
    // Only refresh if refreshParam was set to true after initializing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshParam])

  return null
}

export default useRefreshOnNavigation
