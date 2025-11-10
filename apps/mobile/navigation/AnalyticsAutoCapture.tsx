import { useGlobalSearchParams, usePathname } from 'expo-router'
import { usePostHog } from 'posthog-react-native'
import { type PropsWithChildren, useEffect } from 'react'

const AnalyticsAutoCapture = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    posthog.screen(pathname, params)
  }, [pathname, params, posthog])

  return children
}

export default AnalyticsAutoCapture
