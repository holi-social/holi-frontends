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

/**
 * This hook was created to enforce refreshing the content of an already
 * focused screen: Whenever the query parameter 'refresh' is passed, the
 * `onRefresh` function of the refresh context is executed (i.e. all callbacks
 * that were registered using the `useOnRefresh` hook).
 *
 * The reason for this is that it is not possible to navigate to a screen that
 * is already displayed, but changes in query parameters (like 'refresh') can be
 * detected.
 *
 * This is needed e.g. for the case where clicking on a push notification
 * (indicating a change e.g. in space members and therefore requiring a reload)
 * could lead to navigation to an already displayed screen.
 *
 * After triggering the refresh the query parameter is removed again to allow
 * subsequent refreshes.
 */
const useRefreshOnNavigation = ({ initialized = false }: RefreshOnNavigationProps) => {
  const refreshParam = useParam('refresh')
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
