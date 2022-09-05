import { useRouter } from 'next/router'

import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const router = useRouter()

  const navigate = (routeName: string) => router.push(routeName)

  const replaceRoute = (routeName: string) => router.replace(routeName)

  return {
    navigate,
    navigateBack: (fallbackRouteName = '/') => {
      if (window.history.length) {
        router.back()
      } else {
        navigate(fallbackRouteName)
      }
    },
    replaceRoute,
    query: router.query as T,
    pathname: router.asPath,
  }
}

export default useRouting
