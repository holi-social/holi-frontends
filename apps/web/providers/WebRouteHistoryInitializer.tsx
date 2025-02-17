import { useEffect } from 'react'
import { useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'
import { useRouter } from 'next/router'

export const WebRouteHistoryInitializer = () => {
  const router = useRouter()
  const { syncInitialRoute } = useWebHistory()

  useEffect(() => {
    syncInitialRoute(router.asPath)
    // Only sync once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return null
}
