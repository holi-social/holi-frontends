import { useEffect } from 'react'
import { usePathname, useGlobalSearchParams } from 'expo-router'

export interface CurrentRouteInfo {
  pathname: string
  params: Record<string, string | string[]>
}

let currentPathname = '/'
let currentParams: Record<string, string | string[]> = {}

export const getCurrentRouteInfo = (): CurrentRouteInfo => ({
  pathname: currentPathname,
  params: currentParams,
})

export const useTrackCurrentRoute = (): void => {
  const pathname = usePathname()
  const params = useGlobalSearchParams()

  useEffect(() => {
    currentPathname = pathname
    currentParams = params
  }, [pathname, params])
}

export const setCurrentRouteInfo = (pathname: string, params: Record<string, string | string[]> = {}): void => {
  currentPathname = pathname
  currentParams = params
}

export const resetCurrentRouteInfo = (): void => {
  currentPathname = '/'
  currentParams = {}
}
