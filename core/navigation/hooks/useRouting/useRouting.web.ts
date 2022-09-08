import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const router = useRouter()

  const navigate = useCallback((routeName: string) => router.push(routeName), [router])

  const replaceRoute = useCallback((routeName: string) => router.replace(routeName), [router])

  const navigateBack = useCallback(
    (fallbackRouteName = '/') => {
      if (window.history.length) {
        router.back()
      } else {
        navigate(fallbackRouteName)
      }
    },
    [router, navigate]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    query: router.query as T,
    pathname: router.asPath,
  }
}

export default useRouting
