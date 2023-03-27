import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { useNavigationContext } from '@holi/core/navigation/hooks/NavigationContextProvider/NavigationContext'

import { UseRouting, navigateOptions } from './types'

const useRouting: UseRouting = () => {
  const router = useRouter()
  const { redirectPath, setRedirectAfterLogin, clearRedirectAfterLogin } = useNavigationContext()

  const navigate = useCallback(
    (routeName: string, options?: navigateOptions) => {
      if (options?.redirectAfterLogin) {
        setRedirectAfterLogin(router.asPath)
      }
      router.push(routeName)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  )

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

  const redirect = useCallback(() => {
    if (redirectPath && redirectPath !== '/') {
      clearRedirectAfterLogin()
      navigate(redirectPath)
    }
  }, [redirectPath, clearRedirectAfterLogin, navigate])

  return {
    navigate,
    navigateBack,
    replaceRoute,
    redirect,
    pathname: router.asPath,
  }
}

export default useRouting
